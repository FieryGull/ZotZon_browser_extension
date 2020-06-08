from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import sqlite3

app = Flask(__name__)
CORS(app)


def print_result(cursor):
    for record in cursor.fetchall():
        print('print results  ', record)


def insertDB(data):
    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()
        cursor.execute(f"""
            INSERT INTO ad (title, description, price, category, area) 
            VALUES 
            (
                '{data['title']}', 
                '{data['description']}', 
                '{data['price']}', 
                '{data['category']}', 
                '{data['area']}');
        """)
        id_ad = cursor.lastrowid
        for img in data['images']:
            cursor.execute(f"""
            INSERT INTO image (url, ad_id)
            VALUES
            ('{img}','{id_ad}');
        """)
        connection.commit()
        return id_ad

@app.route('/createAd', methods=['POST'])
def createAd():
    data = request.json
    ad_id = insertDB(data)
    return json.dumps(ad_id)


@app.route('/')
@app.route('/ad/')
def getAd():
    ad_id_url = request.args['id']
    with sqlite3.connect('data.db', detect_types=sqlite3.PARSE_COLNAMES, ) as connection:
        cursor = connection.cursor()

        cursor.execute(f"SELECT title FROM ad WHERE id = {ad_id_url}")
        title = cursor.fetchall()[0][0]

        cursor.execute(f"SELECT description FROM ad WHERE id = {ad_id_url}")
        description = cursor.fetchall()[0][0]

        cursor.execute(f"SELECT price FROM ad WHERE id = {ad_id_url}")
        price = cursor.fetchall()[0][0]

        cursor.execute(f"SELECT category FROM ad WHERE id = {ad_id_url}")
        category = cursor.fetchall()[0][0]

        cursor.execute(f"SELECT area FROM ad WHERE id = {ad_id_url}")
        area = cursor.fetchall()[0][0]

        cursor.execute(f"SELECT url FROM ad INNER JOIN image WHERE ad.id = {ad_id_url} and ad.id = image.ad_id")
        images = cursor.fetchall()

        return render_template('template.html',
                               titleTemp=title,
                               descriptionTemp=description,
                               priceTemp=price,
                               categoryTemp=category,
                               areaTemp=area,
                               images=images,
                               len_img=len(images))


if __name__ == '__main__':
    app.run(host='', port=4567)
