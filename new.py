from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user, user_loader
from flask_mail import Mail, Message

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///property.db'
app.config['SECRET_KEY'] = 'your_secret_key'

# Configuration for Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'your_email@example.com'
app.config['MAIL_PASSWORD'] = 'your_email_password'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

db = SQLAlchemy(app)
mail = Mail(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# Define User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    user_type = db.Column(db.String(10), nullable=False)  # 'seller' or 'buyer'

# User loader function
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Property model
class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    area = db.Column(db.Integer, nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    nearby_facilities = db.Column(db.String(200), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Routes
@app.route('/')
def index():
    if current_user.is_authenticated:
        if current_user.user_type == 'seller':
            return render_template('seller_dashboard.html')
        elif current_user.user_type == 'buyer':
            return render_template('buyer_dashboard.html')
    else:
        return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and user.password == password:
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password. Please try again.', 'error')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/post_property', methods=['POST'])
@login_required
def post_property():
    if current_user.user_type == 'seller':
        title = request.form['propertyTitle']
        price = request.form['price']
        area = request.form['area']
        bedrooms = request.form['bedrooms']
        bathrooms = request.form['bathrooms']
        nearby_facilities = request.form['nearbyFacilities']

        property = Property(title=title, price=price, area=area, bedrooms=bedrooms, bathrooms=bathrooms,
                            nearby_facilities=nearby_facilities, seller_id=current_user.id)
        db.session.add(property)
        db.session.commit()
        flash('Property posted successfully!', 'success')
    else:
        flash('You are not authorized to post properties.', 'error')
    return redirect(url_for('index'))

@app.route('/properties', methods=['GET'])
def get_properties():
    page = request.args.get('page', 1, type=int)
    per_page = 5  # Number of properties per page
    properties = Property.query.paginate(page, per_page, error_out=False)
    property_list = []
    for property in properties.items:
        property_list.append({
            'title': property.title,
            'price': property.price,
            'area': property.area,
            'bedrooms': property.bedrooms,
            'bathrooms': property.bathrooms,
            'nearby_facilities': property.nearby_facilities
        })
    return jsonify(property_list)

# Other routes and models remain the same...

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
