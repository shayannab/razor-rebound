import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

class MLClassifierStage:
    def __init__(self, confidence_threshold=0.6):
        self.confidence_threshold = confidence_threshold
        self.model = None
        
        # We only use weak signals
        self.categorical_features = ['card_sub_type', 'country', 'card_network']
        self.boolean_features = ['has_ticket_notes']
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(handle_unknown='ignore'), self.categorical_features)
            ],
            remainder='passthrough' # For boolean features
        )
        
        self.pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', GradientBoostingClassifier(random_state=42, n_estimators=50, max_depth=3))
        ])

    def _extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df_features = df[self.categorical_features].copy()
        df_features['has_ticket_notes'] = df['ticket_notes'].notna().astype(int)
        return df_features

    def train(self, df_train: pd.DataFrame):
        """
        Trains the classifier. The caller must ensure df_train ONLY contains
        the ambiguous subset (i.e. rows where Rule Engine returns UNKNOWN).
        Training on all data would let it cheat.
        """
        X = self._extract_features(df_train)
        y = df_train['true_label']
        
        self.pipeline.fit(X, y)
        self.model_classes = self.pipeline.classes_

    def predict(self, event: dict):
        if self.model_classes is None:
            raise RuntimeError("Model is not trained yet.")
            
        # Convert event to single-row dataframe for pipeline
        df_event = pd.DataFrame([event])
        X = self._extract_features(df_event)
        
        probas = self.pipeline.predict_proba(X)[0]
        max_idx = np.argmax(probas)
        max_prob = probas[max_idx]
        predicted_class = self.model_classes[max_idx]
        
        if max_prob >= self.confidence_threshold:
            return {
                "root_cause": predicted_class,
                "confidence": float(max_prob),
                "decision_layer": "ml_classifier"
            }
        else:
            # Escalate to unknown if not confident enough
            return {
                "root_cause": "unknown",
                "confidence": float(max_prob),
                "decision_layer": "ml_classifier_escalated"
            }
