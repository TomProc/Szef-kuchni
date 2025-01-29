import os
import cv2
import numpy as np
from skimage.feature import hog
from sklearn.svm import SVC
import time

# Define image size
img_rows, img_cols = 28, 28

# Load and preprocess data
def load_data(data_dir):
    data = []
    labels = []
    for label, category in enumerate(os.listdir(data_dir)):
        category_path = os.path.join(data_dir, category)
        for img_name in os.listdir(category_path):
            img_path = os.path.join(category_path, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            img = cv2.resize(img, (img_rows, img_cols))
            data.append(img)
            labels.append(label)
    return np.array(data), np.array(labels)

train_data_dir = './handgestures/train'
test_data_dir = './handgestures/test'

X_train, y_train = load_data(train_data_dir)
X_test, y_test = load_data(test_data_dir)

# Extract features using HOG
def extract_features(images):
    features = []
    for image in images:
        hog_features = hog(image, orientations=9, pixels_per_cell=(8, 8),
                           cells_per_block=(2, 2), visualize=False)
        features.append(hog_features)
    return np.array(features)

X_train_features = extract_features(X_train)
X_test_features = extract_features(X_test)

# Train SVM classifier
clf = SVC(kernel='linear', probability=True)
clf.fit(X_train_features, y_train)

# Functions to switch screens
def switch_screen(direction):
    if direction == "backward":
        print("Switching to the previous screen...")
    elif direction == "forward":
        print("Switching to the next screen...")

# Real-time prediction
last_prediction = None
start_time = None
gesture_recognition_active = False

def reset_timer():
    global last_prediction, start_time
    last_prediction = None
    start_time = None

current_gesture_direction = None

def set_gesture_direction(direction):
    global current_gesture_direction
    current_gesture_direction = direction

def get_gesture_direction():
    return current_gesture_direction

def start_gesture_recognition():
    global gesture_recognition_active, last_prediction, start_time
    gesture_recognition_active = True
    last_prediction = None  # Ensure these are reset at the start
    start_time = None

    cap = cv2.VideoCapture(0)

    while gesture_recognition_active:
        ret, frame = cap.read()
        frame = cv2.flip(frame, 1)

        # Define ROI
        roi = frame[100:400, 320:620]
        cv2.imshow('ROI', roi)
        roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        roi_resized = cv2.resize(roi_gray, (img_rows, img_cols))

        # Extract HOG features
        roi_features = hog(roi_resized, orientations=9, pixels_per_cell=(8, 8),
                           cells_per_block=(2, 2), visualize=False).reshape(1, -1)

        # Predict
        prediction = clf.predict(roi_features)[0]
        prob = clf.predict_proba(roi_features)[0]

        # Define thresholds for "No gesture recognized"
        if prob.max() < 0.70:
            label = "no gesture recognized"
            set_gesture_direction(None)
        else:
            if prediction == 0:
                label = "Cofnij"
                set_gesture_direction("backward")
            elif prediction == 1:
                label = "Nastepny"
                set_gesture_direction("forward")
            else:
                label = "no gesture recognized"
                set_gesture_direction(None)

            # Update for stable gesture
            if last_prediction == prediction:
                if start_time is None:
                    start_time = time.time()
                elif time.time() - start_time >= 1.0:  # Gesture stable for at least 1 second
                    reset_timer()
            else:
                reset_timer()
                last_prediction = prediction
                start_time = time.time()

        # Display result
        copy = frame.copy()
        cv2.rectangle(copy, (320, 100), (620, 400), (255, 0, 0), 2)
        cv2.putText(copy, label, (300, 100), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow('Frame', copy)

        if cv2.waitKey(1) == 13:  # Enter key
            break

    cap.release()
    cv2.destroyAllWindows()