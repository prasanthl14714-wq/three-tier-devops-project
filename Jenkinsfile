pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "employee-backend"
        FRONTEND_IMAGE = "employee-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                bat 'docker build -t %BACKEND_IMAGE%:latest .\\server'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                bat 'docker build -t %FRONTEND_IMAGE%:latest .\\client'
            }
        }

        stage('Load Images into Minikube') {
            steps {
                bat 'minikube image load %BACKEND_IMAGE%:latest'
                bat 'minikube image load %FRONTEND_IMAGE%:latest'
            }
        }

        stage('Kubernetes Deployment') {
            steps {
                bat 'kubectl apply -f k8s\\configmap.yaml'
                bat 'kubectl apply -f k8s\\secret.yaml'
                bat 'kubectl apply -f k8s\\database'
                bat 'kubectl apply -f k8s\\backend\\backend-deployment.yaml'
                bat 'kubectl apply -f k8s\\backend\\backend-service.yaml'
                bat 'kubectl apply -f k8s\\backend\\frontend\\frontend-deployment.yaml'
                bat 'kubectl apply -f k8s\\backend\\frontend\\frontend-service.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl rollout status deployment/employee-backend -n production'
                bat 'kubectl rollout status deployment/employee-frontend -n production'
                bat 'kubectl get pods -n production'
                bat 'kubectl get svc -n production'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed. Check the Jenkins console output.'
        }
    }
}