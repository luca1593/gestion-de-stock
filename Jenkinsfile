pipeline {
    agent any
    
    environment {
        NG_CLI_ANALYTICS = 'false'
        API_URL = 'http://12.24.5.100:8085'
        CONTAINER_PORT = '4200'
        HOST_PORT = '8086'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t angular-frontend:latest .
                '''
            }
        }
        
        stage('Deploy Container') {
            steps {
                sh '''
                    # Arrêter et supprimer l'ancien conteneur s'il existe
                    docker stop angular-frontend || true
                    docker rm angular-frontend || true
                    
                    # Démarrer le nouveau conteneur
                    docker run -d \
                        --name angular-frontend \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        -e API_URL=${API_URL} \
                        --restart unless-stopped \
                        angular-frontend:latest
                    
                    # Vérifier que le conteneur est en cours d'exécution
                    sleep 5
                    docker ps | grep angular-frontend
                    
                    echo "✅ Application Angular démarrée sur le port ${HOST_PORT}"
                    echo "🌐 Accessible sur http://12.24.5.100:${HOST_PORT}"
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                    # Tester que l'application répond
                    curl -f http://localhost:${HOST_PORT} || echo "⚠️ Application non accessible"
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Déploiement réussi!'
            echo "🌐 Application: http://12.24.5.100:8086"
            echo "📡 Backend: ${API_URL}"
        }
        failure {
            echo '❌ Échec du déploiement'
        }
    }
}