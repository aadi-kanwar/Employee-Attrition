import pickle
import pandas as pd
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Load the pre-trained model and scaler
with open('prediction/model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('prediction/scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

# Define columns and training columns
columns = ['Age', 'BusinessTravel', 'Department', 'JobRole', 'MaritalStatus',
           'Salary', 'OverTime', 'YearsAtCompany', 'YearsInMostRecentRole', 'YearsSinceLastPromotion']

training_columns = ['Age', 'Salary', 'YearsAtCompany', 'YearsInMostRecentRole',
                    'YearsSinceLastPromotion', 'BusinessTravel_No Travel ',
                    'BusinessTravel_Some Travel', 'Department_Sales',
                    'Department_Technology', 'JobRole_Data Scientist',
                    'JobRole_Engineering Manager', 'JobRole_HR Business Partner',
                    'JobRole_HR Executive', 'JobRole_HR Manager',
                    'JobRole_Machine Learning Engineer', 'JobRole_Manager',
                    'JobRole_Recruiter', 'JobRole_Sales Executive',
                    'JobRole_Sales Representative', 'JobRole_Senior Software Engineer',
                    'JobRole_Software Engineer', 'MaritalStatus_Married',
                    'MaritalStatus_Single', 'OverTime_Yes']

def evaluate_model_on_new_data(model, scaler, new_data, columns, training_columns):
    new_df = pd.DataFrame(new_data, columns=columns)

    # Apply one-hot encoding
    X_new = pd.get_dummies(new_df)

    # Add missing columns from the training set
    missing_cols = set(training_columns) - set(X_new.columns)
    for col in missing_cols:
        X_new[col] = 0  # Add missing columns with zeros

    # Reorder columns to match the training data
    X_new = X_new[training_columns]

    # Scale the new data using the same scaler used in training
    X_new_scaled = scaler.transform(X_new)

    # Make predictions
    y_pred_new = model.predict(X_new_scaled)

    # Determine the prediction result
    result = "likely to leave the company" if y_pred_new == 1 else "likely to stay with the company"
    
    return result

@api_view(['POST'])
def predict_attrition(request):
    # Input data from POST request
    data = request.data

    # Evaluate the model on the new data and get the prediction result
    prediction_result = evaluate_model_on_new_data(model, scaler, [data], columns, training_columns)

    return Response({"prediction": prediction_result})
