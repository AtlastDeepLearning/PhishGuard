import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

DATASET_DIR = r'g:\Documents\Coding Portfolio\CYBERSECURITY\phishguard\Training_Dataset'
MODEL_DIR = r'g:\Documents\Coding Portfolio\CYBERSECURITY\phishguard\backend\models'

def train():
    print("Loading unified dataset...")
    df = pd.read_csv(os.path.join(DATASET_DIR, 'unified_dataset.csv'))
    
    # Drop NaNs
    df = df.dropna(subset=['text', 'label'])
    
    # Ensure label is int
    df['label'] = df['label'].astype(int)
    
    X = df['text']
    y = df['label']
    
    print(f"Training on {len(df)} samples...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    
    print("Fitting model...")
    pipeline.fit(X_train, y_train)
    
    print("Evaluating...")
    y_pred = pipeline.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
    print(classification_report(y_test, y_pred))
    
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        
    model_path = os.path.join(MODEL_DIR, 'phish_model_v1.joblib')
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train()
