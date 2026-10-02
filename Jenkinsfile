pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t three-tier-cicd-project-backend:latest ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t three-tier-cicd-project-frontend:latest ./frontend'
            }
        }

        stage('Deploy MySQL') {
            steps {
                bat 'kubectl apply -f k8s/mysql-deployment.yaml'
            }
        }

        stage('Deploy Backend') {
            steps {
                bat 'kubectl apply -f k8s/backend-deployment.yaml'
            }
        }

        stage('Deploy Frontend') {
            steps {
                bat 'kubectl apply -f k8s/frontend-deployment.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods -n employee-app'
                bat 'kubectl get services -n employee-app'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed.'
        }
    }
}
