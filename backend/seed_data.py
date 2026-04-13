"""
Run with: python manage.py shell < seed_data.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
from workshops.models import Category, Workshop

# Clear existing
Workshop.objects.all().delete()
Category.objects.all().delete()

cats = [
    Category.objects.create(name='Python', slug='python', icon='🐍'),
    Category.objects.create(name='Web Development', slug='web-dev', icon='🌐'),
    Category.objects.create(name='Data Science', slug='data-science', icon='📊'),
    Category.objects.create(name='Machine Learning', slug='ml', icon='🤖'),
    Category.objects.create(name='DevOps', slug='devops', icon='⚙️'),
    Category.objects.create(name='Design', slug='design', icon='🎨'),
]

now = timezone.now()

workshops = [
    dict(title='Python for Beginners', description='A hands-on introduction to Python programming. Learn variables, loops, functions, and build your first real-world scripts. Perfect for anyone starting their coding journey.', category=cats[0], instructor_name='Dr. Priya Sharma', instructor_bio='PhD in CS from IIT Bombay. 10+ years teaching Python and data engineering.', level='beginner', status='upcoming', start_date=now+timedelta(days=7), end_date=now+timedelta(days=9), location='Room 101, Tech Block', city='Mumbai', is_online=False, max_participants=30, price=0, tags='python,basics,scripting'),
    dict(title='Advanced Django REST APIs', description='Deep dive into building production-grade REST APIs with Django. Covers serializers, viewsets, authentication, throttling, and deployment best practices.', category=cats[1], instructor_name='Rahul Verma', instructor_bio='Senior Backend Engineer at a top fintech. Contributor to DRF.', level='advanced', status='upcoming', start_date=now+timedelta(days=14), end_date=now+timedelta(days=15), location='Online (Zoom)', city='', is_online=True, max_participants=50, price=1999, tags='django,rest,api,backend'),
    dict(title='Data Visualization with Python', description='Master matplotlib, seaborn, and plotly to tell compelling stories with data. Real datasets used throughout. You will produce publication-ready charts.', category=cats[2], instructor_name='Ananya Krishnan', instructor_bio='Data Lead at Fortune 500. Speaker at PyCon India 2023.', level='intermediate', status='upcoming', start_date=now+timedelta(days=21), end_date=now+timedelta(days=22), location='Online (Google Meet)', city='', is_online=True, max_participants=40, price=999, tags='data,visualization,matplotlib,plotly'),
    dict(title='Machine Learning Bootcamp', description='Intensive 3-day bootcamp covering supervised and unsupervised learning, feature engineering, model evaluation, and deployment with scikit-learn.', category=cats[3], instructor_name='Prof. Amit Patel', instructor_bio='Associate Professor at NIT. Author of two ML textbooks.', level='intermediate', status='upcoming', start_date=now+timedelta(days=28), end_date=now+timedelta(days=30), location='Conference Hall A', city='Bangalore', is_online=False, max_participants=25, price=2999, tags='ml,scikit-learn,ai,bootcamp'),
    dict(title='Docker & Kubernetes Fundamentals', description='Learn containerisation from scratch. Build, ship, and orchestrate applications with Docker and Kubernetes. Includes hands-on labs on a real cluster.', category=cats[4], instructor_name='Vikram Singh', instructor_bio='Cloud Architect. Google Certified Kubernetes Administrator.', level='beginner', status='upcoming', start_date=now+timedelta(days=5), end_date=now+timedelta(days=6), location='Lab 3, Engineering Block', city='Delhi', is_online=False, max_participants=20, price=1499, tags='docker,kubernetes,devops,containers'),
    dict(title='UI/UX Design Principles', description='From wireframes to high-fidelity prototypes. Learn user research, information architecture, and design systems using Figma.', category=cats[5], instructor_name='Neha Joshi', instructor_bio='Lead Designer at a top Indian startup. Adjunct faculty at NID.', level='beginner', status='upcoming', start_date=now+timedelta(days=10), end_date=now+timedelta(days=11), location='Design Studio', city='Pune', is_online=False, max_participants=15, price=799, tags='design,ux,figma,prototyping'),
    dict(title='React & Modern JavaScript', description='Build fast, accessible, and maintainable UIs. Covers React hooks, state management, performance optimisation, and testing.', category=cats[1], instructor_name='Sneha Kulkarni', instructor_bio='Frontend Lead. Maintainer of popular open-source React component libraries.', level='intermediate', status='ongoing', start_date=now-timedelta(days=1), end_date=now+timedelta(days=1), location='Online (Zoom)', city='', is_online=True, max_participants=60, price=1299, tags='react,javascript,frontend,hooks'),
    dict(title='Natural Language Processing', description='Explore text processing, sentiment analysis, and transformer-based models. Build an NLP pipeline from raw text to production service.', category=cats[3], instructor_name='Dr. Ravi Kumar', instructor_bio='NLP Researcher. Published in ACL and EMNLP.', level='advanced', status='upcoming', start_date=now+timedelta(days=35), end_date=now+timedelta(days=37), location='Seminar Hall', city='Hyderabad', is_online=False, max_participants=20, price=3499, tags='nlp,transformers,bert,ai'),
    dict(title='Git & Open Source Workflow', description='Master version control, collaborative workflows, pull requests, and contributing to open source projects effectively.', category=cats[4], instructor_name='Arjun Menon', instructor_bio='Staff Engineer. Top contributor to several open-source projects.', level='beginner', status='completed', start_date=now-timedelta(days=20), end_date=now-timedelta(days=19), location='Online (Zoom)', city='', is_online=True, max_participants=80, price=0, tags='git,github,opensource,version-control'),
    dict(title='Introduction to Figma', description='Get productive in Figma fast. Components, auto-layout, variants, and exporting for developers. No design background needed.', category=cats[5], instructor_name='Divya Reddy', instructor_bio='Product Designer at a Series-B startup. Figma Community Ambassador.', level='beginner', status='upcoming', start_date=now+timedelta(days=18), end_date=now+timedelta(days=18), location='Online (Google Meet)', city='', is_online=True, max_participants=45, price=499, tags='figma,design,ui,tools'),
]

for w in workshops:
    Workshop.objects.create(**w)

print(f"✅ Seeded {len(cats)} categories and {len(workshops)} workshops.")
