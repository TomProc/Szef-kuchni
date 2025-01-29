# -*- coding: utf-8 -*-
# filepath: /c:/Users/tomek/source/repos/Szef-kuchni/main.py

from flask import Flask, request, jsonify, Response, render_template, send_file
from config import app, db
from models import Recipe
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import io
import json
import threading
import gesture_recognition

pdfmetrics.registerFont(TTFont('AbhayaLibre-Regular', 'AbhayaLibre-Regular.ttf'))
pdfmetrics.registerFont(TTFont('AbhayaLibre-Bold', 'AbhayaLibre-Bold.ttf'))

#  przykładowe wywołanie http://127.0.0.1:5000/get_recipes?sort_by=time&order=desc

@app.route('/start_gesture_recognition', methods=['POST'])
def start_gesture_recognition_route():
    # Start gesture recognition in a separate thread to avoid blocking Flask
    thread = threading.Thread(target=gesture_recognition.start_gesture_recognition)
    thread.start()

    return jsonify({"message": "Gesture recognition started"}), 200

@app.route('/get_gesture', methods=['GET'])
def get_gesture():
    direction = gesture_recognition.get_gesture_direction()
    return jsonify({"direction": direction}), 200




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


@app.route('/export_recipe/<int:id_recipe>', methods=['GET'])
def export_recipe(id_recipe):
    recipe = Recipe.query.get(id_recipe)

    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    # Tworzymy plik PDF w pamięci
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle(f"Przepis - {recipe.name}")

    # Ustawienia wyglądu dokumentu
    pdf.setFont("AbhayaLibre-Bold", 16)
    pdf.drawString(100, 750, f"Przepis: {recipe.name}")

    pdf.setFont("AbhayaLibre-Regular", 12)
    pdf.drawString(100, 720, f"Czas przygotowania: {recipe.time} minut")
    pdf.drawString(100, 700, f"Poziom trudności: {recipe.difficulty}")
    pdf.drawString(100, 680, f"Ulubione: {'Tak' if recipe.favourite else 'Nie'}")

    pdf.setFont("AbhayaLibre-Bold", 14)
    pdf.drawString(100, 650, "Składniki:")
    
    pdf.setFont("AbhayaLibre-Regular", 12)
    ingredients_list = recipe.ingredients.split(", ")
    y_position = 630
    for ingredient in ingredients_list:
        pdf.drawString(120, y_position, f"- {ingredient}")
        y_position -= 20

    pdf.setFont("AbhayaLibre-Bold", 14)
    pdf.drawString(100, y_position - 20, "Sposób przygotowania:")
    
    pdf.setFont("AbhayaLibre-Regular", 12)
    preparation_steps = recipe.preparation.split(". ")
    y_position -= 40
    for step in preparation_steps:
        pdf.drawString(120, y_position, f"• {step}")
        y_position -= 20

    pdf.showPage()
    pdf.save()

    buffer.seek(0)

    # Zwracamy plik PDF jako odpowiedź
    return send_file(buffer, as_attachment=True, download_name=f"{recipe.name}.pdf", mimetype='application/pdf')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
