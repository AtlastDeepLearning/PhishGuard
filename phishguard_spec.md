# PhishGuard — High-level Systems Description

## 1) Project purpose (elevator)
PhishGuard is a real-time phishing detection and prevention platform that inspects inbound messages, URLs, attachments, and user interactions (email/web) to identify phishing campaigns, block malicious content, and feed prioritized alerts and remediation to security operators or automated enforcement points. It combines ML models (content + URL + attachment analysis), rule logic, threat intelligence, and human review to minimize false positives while rapidly stopping phishing attacks.

## 2) Primary capabilities / use cases
- **Email gateway integration**: inline scanning (or in parallel) of inbound/outbound mail to block or quarantine phishing emails.
- **URL rewriting & inspection**: detect malicious landing pages and block or rewriter links to safe redirector.
- **Attachment analysis**: static + dynamic analysis (sandbox) and ML classification of attachments (Office macros, PDFs, images).
- **User reporting / feedback loop**: in-product “Report Phish” button that sends suspected items for triage and model retraining.
- **Incident workflow & SOAR integration**: telemetry and verdicts posted to SIEM/SOAR, automated take-down requests for malicious domains.
- **Enterprise reporting & metrics**: dashboards for phish volume, detection rate, false positives, impacted users.
- **Browser / endpoint protection integration**: block malicious URLs at endpoint or via secure web gateways.

## 3) End-to-end data & control flow (operational summary)
- **Ingress**: emails/URLs/attachments arrive via SMTP relay / API connector (Office365/G-Suite) or are reported by users/endpoint agents.
- **Pre-filter**: lightweight rule checks (known-good senders, allowlist), reputation checks (IP/domain), and caching for common URLs.
- **Feature extraction**:
    - Email: headers, DKIM/SPF/DMARC signals, tokenized text, contextual features (time, sender history).
    - URLs: lexical features, WHOIS, hosting info, redirection chains, TLS certs.
    - Attachments: file metadata, embedded objects, macro presence, image OCR.
- **Model inference**:
    - Fast, small models for inline/low-latency decisions (e.g., gradient-boosted trees or lightweight CNNs).
    - Deeper models (transformers, larger CNNs) for higher-confidence offline/batching or human-review work queue.
- **Sandbox / dynamic analysis**: suspicious attachments or URLs execute in isolated sandbox for behavioral signals.
- **Decision**: combine model score + rules + TI + sandbox result → verdict (allow / quarantine / block / tag).
- **Action**: apply policy (quarantine in mail store, rewrite link, block at SWG, create SOC ticket, notify user).
- **Feedback & retraining**: human triage labels flow back to training set, periodic model retrain & deploy.
- **Telemetry**: events and alerts pushed to SIEM, dashboards, and SOAR playbooks for automated or manual response.

## 4) Core components (microservice view)
- **Ingest & Connectors**: SMTP relays, O365/Gmail connectors, API for user reports, endpoint agents.
- **Preprocessing / Feature Service**: normalized features, enrichment (WHOIS, DB lookups, TI).
- **Model Serving**:
    - Low-latency inference service (CPU-optimized or quantized models).
    - High-accuracy batch service (GPU/accelerator nodes for heavy models / sandbox).
- **Sandbox / Behavior Analysis**: containerized/dedicated dynamic analysis environment.
- **Policy Engine**: organizes rules, thresholds, allow/deny lists, and action mapping.
- **Orchestration & Queueing**: message bus (Kafka/RabbitMQ) for reliable event flow and backpressure.
- **Datastore(s)**:
    - Fast cache (Redis) for verdict cache.
    - Time-series DB for metrics (Prometheus, Influx).
    - Columnar or document store for events (ElasticSearch, ClickHouse, or Postgres for relational).
    - Long-term data lake for raw artifacts & training data (S3 or equivalent).
- **Admin / SOC UI & APIs**: triage console, analytics dashboards, exportable reports.
- **Integration & Automation**: connectors to SIEM, IR tools, MTA/MX, Secure Web Gateways, CASB.
- **ML Ops**: feature store, training pipelines, model registry (MLflow), CI/CD for models.

## 5) Scalability model & design patterns
### Principles
- Keep inference stateless and horizontally scalable.
- Make most common decisions with small, cheap models + caching.
- Route suspicious items to heavier processing asynchronously.
- Use autoscaling for peak mail flows and sandbox bursts.
- Separate control plane (policy, config) from data plane (inference, IO) to scale independently.

### Horizontal scaling
- Deploy inference as stateless containers behind a load balancer (Kubernetes with HPA/VPA).
- Use autoscaling groups for sandbox workers (scale up on queue depth).
- Cache verdicts in Redis to avoid reprocessing same sender/link across many recipients.

### Vertical / specialized scaling
- GPU-enabled clusters for retraining and heavy inference (batch jobs).
- CPU clusters (many small VMs) for low-latency inline inference.

### Asynchronous & hybrid processing
- Inline pipeline does quick checks and can reply with temporary hold + user notification.
- Heavy dynamic analysis runs asynchronously; if later deemed malicious, system retroactively quarantines and notifies recipients.

### Multi-tenant & sharding
- For managed SaaS: tenant isolation via namespaces, separate S3 buckets, tenant-scoped model drift metrics, and per-tenant policy store.
- Shard data ingestion by tenant or geographic region to respect data residency & reduce blast radius.

## 6) Performance & capacity planning (example figures)
- **Latency target for inline decision**: 50–200 ms (for synchronous SMTP filtering).
- **Sandbox turnaround**: 30–300 seconds (acceptable for asynchronous decisions).
- **Throughput**: autoscale to handle peak mails per minute; provision baseline for average RPS with burst headroom.
- **Cache hit expectation**: High — many mass phishing campaigns reuse URLs; aim 60–80% cache hit to reduce load.
- **Scaling tactics**:
    - Model quantization & distillation for faster CPU inference.
    - Batching for GPU throughput in non-real-time pipelines.
    - CDN + global edge nodes for URL rewriting and fast block pages.

## 7) Security, privacy, and compliance controls
### Data protection
- TLS everywhere; encrypt artifacts at rest (KMS).
- Tenant data separation; role-based access controls (RBAC).
- PII minimization for stored messages (hash sensitive fields if not needed).

### Model security
- Validate training data provenance to avoid poisoning.
- Use differential privacy or secure aggregation if training on customer data.
- Monitor for model drift and adversarial inputs.

### Attack surface
- Harden connectors to mail systems; validate inbound signatures (SPF/DKIM/DMARC).
- Rate-limit APIs and agent endpoints; WAF + API gateway.

### Operational security
- Secrets in vault (HashiCorp Vault/AWS Secrets Manager).
- Audit logs for model changes and policy updates.
- Dedicated SOC playbooks for false positive/negative spikes.

### Compliance
- Data retention policies configurable per-tenant to meet GDPR, CCPA.
- Export controls for certain telemetry; allow data export/delete per user request.

## 8) Detection quality goals & metrics
### Primary metrics
- True Positive Rate (recall), False Positive Rate, Precision, F1 score.
- Mean time to detect (MTTD), mean time to remediate (MTTR).
- User-reported false positives per 10k messages.

### Operational KPIs
- % of malicious emails blocked inline.
- Time distribution for sandbox verdicts.
- Model drift rate (need for retrain).
- Define SLOs (e.g., <0.1% false positive rate at 95% confidence or block 95% of identified malicious URLs while keeping user disruption under X).

## 9) Human-in-the-loop & continuous learning
- Triage queue where SOC analysts review uncertain cases; labels feed back to training store.
- Prioritize human review for high-value targets (executives) and ambiguous items.
- Automated label curation: combine human labels, sandbox signals, and community TI.
- Scheduled retraining: weekly or event-triggered (after significant campaign) with validation suites before model promotion.

## 10) Resilience & high availability
- Multi-AZ / multi-region deployment for ingest endpoints and caches.
- Use durable message bus (Kafka, SQS) with at-least-once delivery semantics.
- Graceful degradation: if ML service unavailable, fall back to rule-based allow/deny with conservative defaults (e.g., quarantine).
- Disaster recovery: warm standby for critical services (policy engine, connectors).

## 11) Integrations & enforcement points
- **Mail**: SMTP relay, Exchange transport agents, Office365/Gmail API connectors.
- **Web**: URL rewriting + redirector service, SWG integration, browser plugin/extension.
- **Endpoint**: EDR hooks to block execution of downloaded payloads.
- **Network**: Firewall / proxy blocks, DNS sinkholing for malicious domains.
- **Orchestration**: SIEM and SOAR (Splunk, QRadar, Palo Alto Cortex XSOAR).

## 12) Example deployment / infra choices (recommended)
- **Orchestration**: Kubernetes (EKS/GKE/AKS) with HPA and nodepools for GPU/CPU.
- **Queue**: Kafka for high throughput; or managed (MSK) / SQS for simpler ops.
- **Model Serving**: KFServing / TorchServe or Triton for model inference. Use fast CPU-quantized models for inline.
- **Storage**: S3-compatible for raw artifacts; Redis for cache; ES or ClickHouse for telemetry.
- **Sandbox**: Container-based isolated worker cluster, orchestrated by Kubernetes with strict network egress control and snapshot rollback.
- **Observability**: Prometheus + Grafana, ELK stack, and distributed tracing (Jaeger).
- **CI/CD & MLOps**: GitOps (ArgoCD), MLflow/Weights & Biases for model tracking.

## 13) Threat model & adversarial considerations
- **Adversarial content**: obfuscated URLs, embedded images that contain text, living-off-the-land attachments. Counter: multi-modal analysis (OCR + NLP + static + dynamic).
- **Model poisoning**: adversaries injecting poisoned labels via public reporting. Counter: label validation, reputation scoring of reporters.
- **Evasion**: attackers change payloads to bypass heuristics. Counter: sandbox behavior signals and rapid threat intelligence updates.
- **Data leakage**: sensitive content processed by PhishGuard. Counter: redaction, encryption, strict access controls.

## 14) Runbook / SOC playbook (short)
- **Alert triage**: automated scoring → SOC queue for high-score but low-confidence items.
- **Containment**: quarantine message, block URL at SWG/DNS, disable link via rewrite.
- **Eradication**: remove delivered messages, reset credentials for compromised users, block malicious domains.
- **Recovery**: restore user mailbox items if needed, confirm cleanup.
- **Post-incident**: add indicators into TI, retrain models if campaign unique.

## 15) Roadmap / next steps (practical)
- **MVP**: connectors + lightweight models + policy engine + basic UI + cache.
- **Phase 2**: sandbox integration, triage queue, SIEM/SOAR integration.
- **Phase 3**: advanced ML models, continuous retraining, tenant hardening and multi-region HA.
- **Phase 4**: browser/endpoint agent, telemetry-based automated remediation, managed reporting & analytics.

## 16) Trade-offs & considerations
- **Latency vs accuracy**: inline decisions require small models or rule fallbacks; heavy models raise latency and cost.
- **Cost**: sandbox and GPU inference are expensive; use caching, batching, and triage to limit usage.
- **False positives**: SOC workload grows with false positives — invest early in quality and human-in-the-loop design.
- **Privacy**: business/legal constraints may restrict what content can be stored/processed; design flexible retention and redaction.
