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
    sort_by = request.args.get('sort_by', 'id')  # Domyślne sortowanie po 'id'
    order = request.args.get('order', 'asc')     # Domyślne sortowanie rosnące
    
    # Pobieranie parametrów filtrowania
    time_max = request.args.get('time_max', type=int)  # Maksymalny czas przygotowania
    difficulty = request.args.get('difficulty', type=int)  # Poziom trudności
    favourite = request.args.get('favourite', type=bool)  # Tylko ulubione
    ingredients = request.args.getlist('ingredients')  # Lista składników do wyszukiwania

    # Budowanie zapytania do bazy danych
    query = Recipe.query

    # Filtrowanie po maksymalnym czasie przygotowania
    if time_max:
        query = query.filter(Recipe.time <= time_max)

    # Filtrowanie po poziomie trudności
    if difficulty:
        query = query.filter(Recipe.difficulty == difficulty)

    # Filtrowanie po ulubionych
    if favourite:
        query = query.filter(Recipe.favourite == True)

    # Filtrowanie po składnikach (jeśli podano)
    if ingredients:
        query = query.filter(
            db.and_(*(Recipe.ingredients.like(f'%{ingredient}%') for ingredient in ingredients))
        )

    # Sortowanie wyników
    if order == 'desc':
        query = query.order_by(getattr(Recipe, sort_by).desc())
    else:
        query = query.order_by(getattr(Recipe, sort_by).asc())

    # Pobieranie przepisów z bazy danych
    recipes = query.all()
    json_recipes = list(map(lambda x: x.to_json(), recipes))  # Konwersja wyników do JSON-a

    # Tworzenie odpowiedzi
    response = app.response_class(
        response=json.dumps({'recipes': json_recipes}, ensure_ascii=False),
        mimetype='application/json; charset=utf-8'
    )
    return response



#dodawanie do ulubionych czyli edytowanie kolumny favourite

@app.route('/add_to_favourites/<int:id_recipe>', methods=['PATCH'])
def add_to_favourites(id_recipe):
    recipe=Recipe.query.get(id_recipe)

    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    data=request.json
    recipe.favourite=data.get('favourite', recipe.favourite)
    db.session.commit()
    return jsonify({'message': 'Recipe added to favourites successfully'})


# wyszukiwanie przepisów po składnikach
@app.route('/search_recipes', methods=['GET'])
def search_recipes():
    # Pobranie listy składników z parametrów zapytania
    ingredients = request.args.getlist('ingredients')
    
    if not ingredients:
        return jsonify({'error': 'No ingredients provided'}), 400

    # Wyszukiwanie przepisów, które zawierają wszystkie podane składniki
    matching_recipes = Recipe.query.filter(
        db.and_(*(Recipe.ingredients.like(f'%{ingredient}%') for ingredient in ingredients))
    ).all()

    # Konwersja wyników do formatu JSON
    json_recipes = [recipe.to_json() for recipe in matching_recipes]

    return jsonify({'recipes': json_recipes})



if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)