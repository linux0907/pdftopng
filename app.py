from flask import Flask, render_template, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import os
from pdf2image import convert_from_path
import uuid

app = Flask(__name__)

# 폴더 설정
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

# 폴더 없으면 생성
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'pdf' not in request.files:
        return jsonify({'error': '파일이 없습니다.'}), 400

    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': '파일 이름이 없습니다.'}), 400

    filename = secure_filename(file.filename)
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(pdf_path)

    try:
        # 랜덤 이름으로 저장
        output_filename = f"{uuid.uuid4().hex}.png"
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)

        # PDF 첫 페이지만 PNG로 변환
        images = convert_from_path(pdf_path)
        images[0].save(output_path, 'PNG')

        return jsonify({'download_url': f'/download/{output_filename}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
