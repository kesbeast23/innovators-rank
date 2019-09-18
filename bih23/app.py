import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict',methods=['POST'])
def predict():
    '''
     this is where rendering results on HTML GUI
    '''
     # Add the Data using pandas
    Corpus = pd.read_csv(r"tech.csv",encoding='latin-1')
    print(Corpus)

    sentences = Corpus['text'].values
    y = Corpus['label'].values

    sentences_train, sentences_test, y_train, y_test = train_test_split(
    sentences, y, test_size=0.25, random_state=1000)

    vectorizer = CountVectorizer()
    vectorizer.fit(sentences_train)

    X_train = vectorizer.transform(sentences_train)
    X_test  = vectorizer.transform(sentences_test)


    classifier = LogisticRegression()
    classifier.fit(X_train, y_train)
    score = classifier.score(X_test, y_test)

    print("Accuracy:", score)
    
    text = request.form['text']
    query = text
    query = query.lower()
    query = [query]
    query = vectorizer.transform(query)

    prediction = classifier.predict_proba(query)

    output = max(list(prediction))

    #return render_template('index.html', prediction_text='The top innovator is {}'.format(output))
    return jsonify({"rank": output})


@app.route('/predict_api',methods=['POST'])
def predict_api():
    '''
    For direct API calls trought request
    '''
    data = request.get_json(force=True)
    prediction = classifier.predict_proba([np.array(query)])

    output = prediction[0]
    return jsonify(output)

if __name__ == "__main__":
    app.run(debug=True, port=6666)