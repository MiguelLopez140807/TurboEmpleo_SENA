from locust import HttpUser, task, between

class TurboEmpleoUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def landing_page(self):
        self.client.get("/")

    @task
    def login_page(self):
        self.client.get("/login")

    @task
    def register_page(self):
        self.client.get("/register")

    @task
    def post_login(self):
        self.client.post("/api/login", json={"email": "usuario@falso.com", "password": "contraseña_incorrecta"})

    @task
    def vacantes_disponibles(self):
        self.client.get("/aspirantes/vacantes")
