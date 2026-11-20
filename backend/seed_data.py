import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.files.base import ContentFile
from core.models import CustomUser, Category, Course, Order, OrderItem, Review

def run():
    # 1. Категории
    cats = {}
    for name, slug in [
        ('Программирование', 'programming'),
        ('Дизайн и UX/UI', 'design'),
        ('Маркетинг', 'marketing'),
        ('Аналитика данных', 'analytics'),
    ]:
        cats[slug], _ = Category.objects.get_or_create(slug=slug, defaults={'name': name})

    # 2. Авторы и тестовый студент
    author1, _ = CustomUser.objects.get_or_create(
        username='alex_dev',
        defaults={
            'email': 'alex@eduspace.ru',
            'role': 'author',
            'bio': 'Senior Python & Django разработчик с опытом 8 лет. Архитектор высоконагруженных веб-сервисов.'
        }
    )
    author1.set_password('pass12345')
    author1.save()

    author2, _ = CustomUser.objects.get_or_create(
        username='maria_design',
        defaults={
            'email': 'maria@eduspace.ru',
            'role': 'author',
            'bio': 'Арт-директор и продуктовый дизайнер. Специализируюсь на дизайн-системах и интерфейсах сложных сервисов.'
        }
    )
    author2.set_password('pass12345')
    author2.save()

    student, _ = CustomUser.objects.get_or_create(
        username='ivan_student',
        defaults={'email': 'ivan@eduspace.ru', 'role': 'student'}
    )
    student.set_password('pass12345')
    student.save()

    # 3. Курсы (6 штук для красивой сетки 3x2)
    courses_data = [
        (
            'Full-Stack разработка на Python, DRF и React',
            'Практический курс по созданию современных веб-приложений с нуля: проектирование БД, REST API, JWT-авторизация, React 18 и деплой в Docker.',
            'Модуль 1. Архитектура REST API и Django ORM\nМодуль 2. JWT-аутентификация и права доступа\nМодуль 3. Разработка SPA на React 18 и TailwindCSS\nМодуль 4. Контейнеризация в Docker Compose',
            12900, author1, cats['programming']
        ),
        (
            'Асинхронный Python и FastAPI на практике',
            'Научитесь писать быстрые микросервисы, работать с asyncio, SQLAlchemy 2.0, Redis и автодокументацией OpenAPI.',
            'Модуль 1. Введение в asyncio и event loop\nМодуль 2. Валидация данных через Pydantic v2\nМодуль 3. Асинхронная работа с PostgreSQL\nМодуль 4. Тестирование через Pytest',
            9500, author1, cats['programming']
        ),
        (
            'UX/UI дизайн современных веб-платформ в Figma',
            'Пошаговое руководство по проектированию интерфейсов: от прототипирования и типографики до создания масштабируемых дизайн-систем.',
            'Модуль 1. Композиция, сетки и типографика\nМодуль 2. Auto Layout и компоненты в Figma\nМодуль 3. Проектирование пользовательских сценариев\nМодуль 4. Передача макетов в разработку',
            8400, author2, cats['design']
        ),
        (
            'Аналитика данных на Python: Pandas, NumPy и SQL',
            'Освойте сбор, очистку и визуализацию больших массивов данных для принятия продуктовых решений.',
            'Модуль 1. Продвинутые SQL-запросы и оконные функции\nМодуль 2. Обработка таблиц в Pandas\nМодуль 3. Визуализация в Matplotlib и Seaborn\nМодуль 4. A/B-тестирование и метрики продукта',
            11200, author1, cats['analytics']
        ),
        (
            'Продуктовый маркетинг и запуск IT-стартапов',
            'Как вывести цифровой продукт на рынок, рассчитать юнит-экономику и выстроить воронку привлечения пользователей.',
            'Модуль 1. Анализ рынка и CustDev\nМодуль 2. Расчет CAC, LTV и юнит-экономики\nМодуль 3. Контент-маркетинг и SEO\nМодуль 4. Сквозная аналитика продаж',
            7800, author2, cats['marketing']
        ),
        (
            'Проектирование систем и дизайн-токены',
            'Углубленный курс для дизайнеров, которые хотят создавать единые визуальные языки для веб и мобильных продуктов.',
            'Модуль 1. Архитектура дизайн-токенов\nМодуль 2. Доступность интерфейсов (WCAG)\nМодуль 3. Документация компонентов\nМодуль 4. Синхронизация с TailwindCSS',
            6900, author2, cats['design']
        ),
    ]

    created_courses = []
    for title, desc, syllabus, price, author, cat in courses_data:
        course, created = Course.objects.get_or_create(
            title=title,
            defaults={
                'description': desc,
                'syllabus': syllabus,
                'price': price,
                'author': author,
                'category': cat,
            }
        )
        if not course.material_file:
            content = f"Учебные материалы курса: {title}\n\nПрограмма:\n{syllabus}\n\nУспешного обучения на платформе EduSpace!".encode('utf-8')
            course.material_file.save(f"materials_{course.id}.txt", ContentFile(content), save=True)
        created_courses.append(course)

    # 4. Тестовый заказ и отзывы
    if not Order.objects.filter(user=student).exists():
        order = Order.objects.create(user=student, total_price=created_courses[0].price, status='paid')
        OrderItem.objects.create(order=order, course=created_courses[0], price_at_purchase=created_courses[0].price)

    Review.objects.get_or_create(
        course=created_courses[0],
        user=student,
        defaults={'rating': 5, 'text': 'Отличный структурированный курс! Все разобрано на реальном проекте от БД до React.'}
    )
    Review.objects.get_or_create(
        course=created_courses[2],
        user=student,
        defaults={'rating': 5, 'text': 'Очень понятная подача материала, сразу применил знания в своем дипломном проекте.'}
    )

    print("База данных успешно наполнена демо-курсами, авторами и отзывами!")

if __name__ == '__main__':
    run()