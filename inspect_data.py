import os
import pandas as pd

dataset_dir = r'g:\Documents\Coding Portfolio\CYBERSECURITY\phishguard\Training_Dataset'
files = [f for f in os.listdir(dataset_dir) if f.endswith('.csv')]

for f in files:
    path = os.path.join(dataset_dir, f)
    try:
        df = pd.read_csv(path, nrows=2)
        print(f"--- {f} ---")
        print(df.columns.tolist())
        print(df.head(1))
        print("\n")
    except Exception as e:
        print(f"Error reading {f}: {e}")
