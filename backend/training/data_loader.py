import os
import pandas as pd
import numpy as np

DATASET_DIR = r'g:\Documents\Coding Portfolio\CYBERSECURITY\phishguard\Training_Dataset'

def load_and_unify_data():
    all_data = []
    
    files = [f for f in os.listdir(DATASET_DIR) if f.endswith('.csv')]
    
    for f in files:
        path = os.path.join(DATASET_DIR, f)
        try:
            df = pd.read_csv(path, on_bad_lines='skip')
            print(f"Loading {f} with shape {df.shape}")
            
            # Normalize columns
            if 'text_combined' in df.columns:
                # Schema B
                df = df[['text_combined', 'label']].rename(columns={'text_combined': 'text'})
            elif 'body' in df.columns and 'subject' in df.columns:
                # Schema A
                df['text'] = df['subject'].fillna('') + " " + df['body'].fillna('')
                if 'label' in df.columns:
                    df = df[['text', 'label']]
                else:
                    print(f"Skipping {f}: No label column found")
                    continue
            else:
                print(f"Skipping {f}: Unknown schema {df.columns.tolist()}")
                continue
            
            # Normalize labels (assuming 1=phish, 0=safe or similar, need to check values)
            # For now, just keeping as is, but ensuring it's numeric if possible
            # We might need to inspect label values later
            
            all_data.append(df)
            
        except Exception as e:
            print(f"Error loading {f}: {e}")
            
    if not all_data:
        raise ValueError("No data loaded")
        
    unified_df = pd.concat(all_data, ignore_index=True)
    print(f"Total data shape: {unified_df.shape}")
    return unified_df

if __name__ == "__main__":
    df = load_and_unify_data()
    print(df['label'].value_counts())
    df.to_csv(os.path.join(DATASET_DIR, 'unified_dataset.csv'), index=False)
