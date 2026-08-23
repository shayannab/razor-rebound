import random
import uuid
import pandas as pd

def generate_dataset(n_samples: int, seed: int) -> pd.DataFrame:
    rng = random.Random(seed)
    data = []
    
    # 45% 3DS, 15% risk block, 10% bank-partner block, 10% integration mismatch, 10% bank technical, 10% ambiguous
    # We define the true labels for all of them.
    # For ambiguous ones, they are actually bank-partner block or bank technical, but their error_code is generic.
    
    for _ in range(n_samples):
        rand_val = rng.random()
        
        # Base defaults
        payment_id = f"pay_{uuid.UUID(int=rng.getrandbits(128), version=4).hex[:14]}"
        card_issuer = rng.choice(['Chase', 'Citi', 'Barclays', 'HSBC', 'Wells Fargo', 'Unknown'])
        card_network = rng.choice(['Visa', 'MasterCard', 'Amex'])
        card_sub_type = rng.choice(['credit', 'debit', 'prepaid'])
        country = rng.choice(['US', 'UK', 'IN', 'AE', 'SG'])
        international = True # All are international as per prompt
        error_step = rng.choice(['payment_authentication', 'payment_authorization'])
        error_reason = 'payment_failed'
        ticket_notes = None
        
        if rand_val < 0.45:
            # 3DS / card_not_enrolled
            true_label = '3ds_enrollment_issue'
            error_code = 'card_not_enrolled'
            error_source = 'bank'
        elif rand_val < 0.60:
            # Risk block
            true_label = 'risk_block'
            error_code = 'payment_risk_check_failed'
            error_source = 'gateway'
            if rng.random() < 0.1:
                ticket_notes = "High risk IP detected"
        elif rand_val < 0.70:
            # Bank partner block
            true_label = 'bank_partner_restriction'
            error_code = 'transaction_not_permitted'
            error_source = 'bank'
            # Leakage prevention: give it ticket notes sometimes
            if rng.random() < 0.3:
                ticket_notes = "Cross-border restriction applied by partner"
            # Weak signals correlating with this:
            if rng.random() < 0.6:
                country = 'IN' # Partner blocks often happen for IN
                card_sub_type = 'prepaid'
        elif rand_val < 0.80:
            # Integration mismatch
            true_label = 'integration_bug'
            error_code = 'bad_request_error'
            error_source = 'merchant'
        elif rand_val < 0.90:
            # Bank technical error
            true_label = 'bank_technical_error'
            error_code = 'bank_technical_error'
            error_source = 'bank'
        else:
            # Ambiguous (10%)
            # The rule engine will fail to classify these.
            # True label is mixed between bank_partner_restriction and bank_technical_error
            if rng.random() < 0.5:
                true_label = 'bank_partner_restriction'
                # Weak signals correlating
                if rng.random() < 0.8:
                    country = 'IN'
                    card_sub_type = 'prepaid'
            else:
                true_label = 'bank_technical_error'
            
            error_code = 'technical_error' # Rule engine won't match this code/source combo
            error_source = rng.choice(['gateway', 'bank'])
            
            # Leakage prevention: ambiguous cases get notes 70% of the time
            if rng.random() < 0.7:
                ticket_notes = "Customer reported failure, no clear reason in logs."

        amount = rng.randint(15, 600)
        currency = rng.choice(['USD', 'EUR', 'GBP', 'INR'])

        data.append({
            'payment_id': payment_id,
            'amount': amount,
            'currency': currency,
            'error_code': error_code,
            'error_source': error_source,
            'error_step': error_step,
            'error_reason': error_reason,
            'card_issuer': card_issuer,
            'card_network': card_network,
            'card_sub_type': card_sub_type,
            'country': country,
            'international': international,
            'ticket_notes': ticket_notes,
            'true_label': true_label
        })
        
    return pd.DataFrame(data)

def get_train_test_data():
    # CRITICAL: generate train and test sets with DIFFERENT random seeds
    df_train = generate_dataset(3000, seed=42)
    df_test = generate_dataset(1000, seed=999)
    return df_train, df_test

if __name__ == "__main__":
    train, test = get_train_test_data()
    print(f"Generated {len(train)} train records and {len(test)} test records.")
    print("\nTrain Label Distribution:")
    print(train['true_label'].value_counts(normalize=True))
