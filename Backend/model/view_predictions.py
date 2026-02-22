import pandas as pd
import os
import data_loader

df = pd.read_csv(os.path.join(data_loader.DATA_DIR, "mlp_current_predictions_with_draftability.csv"))