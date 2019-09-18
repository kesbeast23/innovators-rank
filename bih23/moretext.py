import pandas as pd 
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression


# Add the Data using pandas
Corpus = pd.read_csv(r"tech.csv",encoding='latin-1')
print(Corpus)


sentences = Corpus['text'].values
y = Corpus['label'].values
print(sentences.shape)

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


query =  "database management"
query = query.lower()
query = [query]
query = vectorizer.transform(query)

print(classifier.predict(query))