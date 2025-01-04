# -*- coding: utf-8 -*-
# filepath: /c:/Users/tomek/source/repos/Szef-kuchni/app.py

from flask import Flask, request, jsonify, Response, render_template
from config import app, db
from models import Recipe
import json

# @app.route('/get_recipes', methods=['GET']) #decorator    
# def get_recipes():
#     recipes = Recipe.query.all()
#     json_recipies = list(map(lambda x: x.to_json(), recipes)) #new list with json objects
#     return jsonify({'recipies': json_recipies})

# -*- coding: utf-8 -*-





#  przykładowe wywołanie http://127.0.0.1:5000/get_recipes?sort_by=time&order=desc

@app.route('/get_recipes', methods=['GET'])
def get_recipes():
    
    sort_by = request.args.get('sort_by', 'id')  # Domyślnie sortowanie po 'id'
    order = request.args.get('order', 'asc')     # Domyślnie rosnąco (asc)

    
    #['id', 'name', 'time', 'difficulty'] - Obsługiwane sortowanie sortowania

    

   
    if order == 'desc':                                  # Pobranie przepisów z bazy danych i sortowanie
        recipes = Recipe.query.order_by(getattr(Recipe, sort_by).desc()).all()
    else:
        recipes = Recipe.query.order_by(getattr(Recipe, sort_by).asc()).all()

    
    json_recipes = list(map(lambda x: x.to_json(), recipes))# Konwersja wyników do JSON-a

    
    response = app.response_class(
        response=json.dumps({'recipes': json_recipes}, ensure_ascii=False),
        mimetype='application/json; charset=utf-8'
    )
    return response



if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)