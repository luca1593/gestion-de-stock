pipeline {
    agent {
        docker {
            image 'node:18-bullseye'
            args '-v /home/jenkins/.npm:/root/.npm'
        }
    }
    
    environment {
        NG_CLI_ANALYTICS = 'false'
        NODE_VERSION = '18'
        NPM_CONFIG_CACHE = '/root/.npm'
        BUILD_DIR = 'dist/gestion-de-stock'
    }
    
    options {
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        ansiColor('xterm')
    }
    
    parameters {
        choice(name: 'ENVIRONMENT', 
               choices: ['dev', 'staging', 'prod'], 
               description: 'Environnement cible')
        booleanParam(name: 'RUN_TESTS', 
                    defaultValue: true, 
                    description: 'Exécuter les tests')
        booleanParam(name: 'RUN_LINT', 
                    defaultValue: true, 
                    description: 'Exécuter le linting')
        booleanParam(name: 'DEPLOY', 
                    defaultValue: false, 
                    description: 'Déployer après le build')
        choice(name: 'DEPLOY_METHOD', 
               choices: ['rsync', 's3', 'docker', 'tomcat'], 
               description: 'Méthode de déploiement')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "📦 Récupération du code pour ${params.ENVIRONMENT}..."
                checkout scm
                
                script {
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', 
                                              returnStdout: true).trim()
                    env.BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', 
                                            returnStdout: true).trim()
                }
            }
        }
        
        stage('Setup') {
            steps {
                echo "🔧 Configuration Node.js ${NODE_VERSION}..."
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "NPM cache: $(npm config get cache)"
                    
                    # Configurer npm pour les builds CI
                    npm config set fund false
                    npm config set audit false
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installation des dépendances...'
                sh '''
                    # Nettoyer le cache si nécessaire
                    if [ -f "package-lock.json" ]; then
                        echo "Using package-lock.json for deterministic install"
                        npm ci --legacy-peer-deps --prefer-offline --no-audit
                    else
                        echo "No package-lock.json found, running npm install"
                        npm install --legacy-peer-deps --no-audit
                    fi
                '''
            }
        }
        
        stage('Lint') {
            when {
                expression { params.RUN_LINT }
            }
            steps {
                echo '🔍 Exécution du linting...'
                sh '''
                    if npm run lint -- --format=checkstyle > lint-results.xml 2>&1; then
                        echo "✅ Linting passed"
                    else
                        echo "⚠️ Linting found issues (continuing build)"
                        cat lint-results.xml
                    fi
                '''
            }
            post {
                always {
                    recordIssues enabledForFailure: true,
                        aggregatingResults: true,
                        tools: [checkStyle(pattern: 'lint-results.xml')]
                }
            }
        }
        
        stage('Tests Unitaires') {
            when {
                expression { params.RUN_TESTS }
            }
            steps {
                echo '🧪 Exécution des tests unitaires...'
                sh '''
                    # Exécuter les tests avec Karma
                    npm test -- --watch=false \
                                --browsers=ChromeHeadless \
                                --code-coverage \
                                --reporters=progress,junit
                    
                    # Générer le rapport de couverture
                    if [ -d "coverage" ]; then
                        echo "Coverage report generated"
                    fi
                '''
            }
            post {
                always {
                    // Publier les résultats JUnit
                    junit '**/test-results/**/*.xml'
                    
                    // Publier le rapport de couverture
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo "🏗️ Build pour ${params.ENVIRONMENT}..."
                script {
                    def buildCmd = 'npm run build'
                    if (params.ENVIRONMENT == 'prod') {
                        buildCmd = 'npm run build:prod'
                    } else if (params.ENVIRONMENT == 'staging') {
                        buildCmd = 'npm run build:staging'
                    }
                    
                    sh """
                        ${buildCmd}
                        echo "✅ Build completed"
                        echo "Build directory: ${BUILD_DIR}"
                        ls -la ${BUILD_DIR} || echo "⚠️ Build directory not found"
                    """
                }
            }
        }
        
        stage('Optimize Assets') {
            steps {
                echo '📦 Optimisation des assets...'
                sh '''
                    # Optimiser les images si présent
                    if command -v optipng &> /dev/null; then
                        find ${BUILD_DIR} -name "*.png" -exec optipng -o7 {} \\;
                    fi
                    
                    # Vérifier la taille du build
                    BUILD_SIZE=$(du -sh ${BUILD_DIR} | cut -f1)
                    echo "📊 Build size: ${BUILD_SIZE}"
                    
                    # Compresser pour l'archive
                    tar -czf build-${BUILD_TIMESTAMP}.tar.gz -C ${BUILD_DIR} .
                '''
            }
        }
        
        stage('Security Scan') {
            steps {
                echo '🔒 Scan de sécurité...'
                sh '''
                    # Audit des dépendances
                    npm audit --json --audit-level=high > npm-audit.json || true
                    
                    # Vérifier les vulnérabilités critiques
                    if grep -q "\"severity\":\"critical\"" npm-audit.json; then
                        echo "⚠️ Critical vulnerabilities found!"
                    fi
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'npm-audit.json', allowEmptyArchive: true
                }
            }
        }
        
        stage('Archive Build') {
            steps {
                echo '📚 Archivage des artefacts...'
                script {
                    archiveArtifacts artifacts: "${BUILD_DIR}/**", 
                                       fingerprint: true, 
                                       allowEmptyArchive: false
                    
                    archiveArtifacts artifacts: "build-${BUILD_TIMESTAMP}.tar.gz",
                                       fingerprint: true
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                echo "🚀 Déploiement vers ${params.ENVIRONMENT}..."
                script {
                    def deployMethod = params.DEPLOY_METHOD
                    
                    switch(deployMethod) {
                        case 'rsync':
                            deployWithRsync()
                            break
                        case 's3':
                            deployToS3()
                            break
                        case 'docker':
                            deployWithDocker()
                            break
                        case 'tomcat':
                            deployToTomcat()
                            break
                        default:
                            error "Méthode de déploiement inconnue: ${deployMethod}"
                    }
                }
            }
        }
        
        stage('Health Check') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                echo '🏥 Vérification de santé...'
                script {
                    def appUrl = getAppUrl()
                    sh """
                        echo "Vérification de: ${appUrl}"
                        for i in 1 2 3 4 5; do
                            if curl -s -f ${appUrl} > /dev/null; then
                                echo "✅ Application accessible"
                                exit 0
                            fi
                            echo "Tentative \$i/5 - Attente..."
                            sleep 5
                        done
                        echo "⚠️ Application non accessible après 5 tentatives"
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Nettoyage de l\'espace de travail...'
            cleanWs deleteDirs: true, notFailBuild: true
        }
        
        success {
            echo '🎉 Pipeline exécuté avec succès!'
            
            // Envoyer la notification Slack
            slackSend(
                color: 'good',
                message: "✅ Build #${env.BUILD_NUMBER} réussi!\n" +
                         "Environnement: ${params.ENVIRONMENT}\n" +
                         "Commit: ${env.GIT_COMMIT_SHORT}\n" +
                         "Build: ${env.BUILD_URL}"
            )
            
            // Email de succès
            emailext (
                subject: "✅ SUCCESS: Build #${env.BUILD_NUMBER} - Gestion de Stock",
                body: """
                    Build terminé avec succès!
                    
                    📊 Détails:
                    - Build: #${env.BUILD_NUMBER}
                    - Environnement: ${params.ENVIRONMENT}
                    - Branche: ${env.GIT_BRANCH}
                    - Commit: ${env.GIT_COMMIT_SHORT}
                    - Méthode de déploiement: ${params.DEPLOY_METHOD}
                    - URL: ${getAppUrl()}
                    
                    🔗 Consulter: ${env.BUILD_URL}
                """,
                to: 'team@company.com',
                replyTo: 'jenkins@company.com'
            )
        }
        
        failure {
            echo '❌ Échec du pipeline!'
            
            slackSend(
                color: 'danger',
                message: "❌ Build #${env.BUILD_NUMBER} échoué!\n" +
                         "Environnement: ${params.ENVIRONMENT}\n" +
                         "Logs: ${env.BUILD_URL}"
            )
            
            emailext (
                subject: "❌ FAILURE: Build #${env.BUILD_NUMBER} - Gestion de Stock",
                body: """
                    Le build a échoué!
                    
                    📊 Détails:
                    - Build: #${env.BUILD_NUMBER}
                    - Environnement: ${params.ENVIRONMENT}
                    - Branche: ${env.GIT_BRANCH}
                    - Commit: ${env.GIT_COMMIT_SHORT}
                    
                    🔍 Vérifier les logs: ${env.BUILD_URL}
                """,
                to: 'team@company.com'
            )
        }
        
        unstable {
            echo '⚠️ Pipeline instable (tests échoués)'
            slackSend(
                color: 'warning',
                message: "⚠️ Build #${env.BUILD_NUMBER} instable\n" +
                         "Certains tests ont échoué"
            )
        }
    }
}

// Fonctions de déploiement
def deployWithRsync() {
    def servers = [
        dev: 'user@dev-server:/var/www/gestion-de-stock/',
        staging: 'user@staging-server:/var/www/gestion-de-stock/',
        prod: 'user@prod-server:/var/www/gestion-de-stock/'
    ]
    
    def targetServer = servers[params.ENVIRONMENT]
    
    withCredentials([sshUserPrivateKey(
        credentialsId: 'deploy-ssh-key',
        keyFileVariable: 'SSH_KEY',
        usernameVariable: 'SSH_USER'
    )]) {
        sh """
            rsync -avz --delete \
                -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
                ${BUILD_DIR}/ ${targetServer}
        """
    }
}

def deployToS3() {
    withAWS(credentials: 'aws-credentials', region: 'eu-west-3') {
        s3Upload(
            file: "${BUILD_DIR}",
            bucket: "gestion-de-stock-${params.ENVIRONMENT}",
            path: '/',
            sourcePath: "${BUILD_DIR}",
            includePathPattern: '**/*'
        )
    }
}

def deployWithDocker() {
    sh """
        docker build -t gestion-stock:${env.BUILD_TIMESTAMP} .
        docker tag gestion-stock:${env.BUILD_TIMESTAMP} gestion-stock:latest
        
        if [ "${params.ENVIRONMENT}" = "prod" ]; then
            docker push registry.company.com/gestion-stock:${env.BUILD_TIMESTAMP}
        fi
    """
}

def deployToTomcat() {
    withCredentials([usernamePassword(
        credentialsId: 'tomcat-credentials',
        usernameVariable: 'TOMCAT_USER',
        passwordVariable: 'TOMCAT_PASS'
    )]) {
        sh """
            # Créer le WAR à partir du build Angular
            cd ${BUILD_DIR}
            jar -cvf ../gestion-stock.war *
            cd ../..
            
            # Déployer sur Tomcat
            curl -f -u ${TOMCAT_USER}:${TOMCAT_PASS} \
                -X PUT \
                --upload-file gestion-stock.war \
                "http://tomcat-server:8080/manager/text/deploy?path=/gestion-stock&update=true"
        """
    }
}

def getAppUrl() {
    def urls = [
        dev: 'http://dev.company.com/gestion-de-stock',
        staging: 'http://staging.company.com/gestion-de-stock',
        prod: 'https://gestion-stock.company.com'
    ]
    return urls[params.ENVIRONMENT]
}