#!/bin/bash
# Script de gestion du projet TourbF

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Menu Principal
show_menu() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  TourbF - Application de Tourisme${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "${YELLOW}1.${NC} Installer les dépendances"
    echo -e "${YELLOW}2.${NC} Lancer l'application"
    echo -e "${YELLOW}3.${NC} Lancer en mode release"
    echo -e "${YELLOW}4.${NC} Formater le code"
    echo -e "${YELLOW}5.${NC} Analyser le code"
    echo -e "${YELLOW}6.${NC} Exécuter les tests"
    echo -e "${YELLOW}7.${NC} Nettoyer le cache"
    echo -e "${YELLOW}8.${NC} Builder APK"
    echo -e "${YELLOW}9.${NC} Builder IPA"
    echo -e "${YELLOW}10.${NC} Voir les logs"
    echo -e "${YELLOW}11.${NC} Afficher la documentation"
    echo -e "${YELLOW}0.${NC} Quitter"
    echo ""
}

# Fonctions
install_deps() {
    echo -e "${GREEN}Installation des dépendances...${NC}"
    flutter pub get
    echo -e "${GREEN}✓ Dépendances installées${NC}"
}

run_app() {
    echo -e "${GREEN}Lancement de l'application...${NC}"
    flutter run
}

run_release() {
    echo -e "${GREEN}Lancement en mode release...${NC}"
    flutter run --release
}

format_code() {
    echo -e "${GREEN}Formatage du code...${NC}"
    flutter format lib/
    echo -e "${GREEN}✓ Code formaté${NC}"
}

analyze_code() {
    echo -e "${GREEN}Analyse du code...${NC}"
    flutter analyze
    echo -e "${GREEN}✓ Analyse terminée${NC}"
}

run_tests() {
    echo -e "${GREEN}Exécution des tests...${NC}"
    flutter test
    echo -e "${GREEN}✓ Tests terminés${NC}"
}

clean_cache() {
    echo -e "${YELLOW}Nettoyage du cache...${NC}"
    flutter clean
    flutter pub get
    echo -e "${GREEN}✓ Cache nettoyé${NC}"
}

build_apk() {
    echo -e "${GREEN}Building APK...${NC}"
    flutter build apk --release
    echo -e "${GREEN}✓ APK créé à: build/app/outputs/app-release.apk${NC}"
}

build_ipa() {
    echo -e "${GREEN}Building IPA...${NC}"
    flutter build ipa --release
    echo -e "${GREEN}✓ IPA créé à: build/ios/ipa/${NC}"
}

show_logs() {
    echo -e "${GREEN}Affichage des logs...${NC}"
    flutter logs
}

show_docs() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  DOCUMENTATION${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "${YELLOW}1.${NC} Ouvrir README.md"
    echo -e "${YELLOW}2.${NC} Ouvrir GUIDE_COMPLET.md"
    echo -e "${YELLOW}3.${NC} Ouvrir CONFIG.md"
    echo -e "${YELLOW}4.${NC} Ouvrir QUICKSTART.md"
    echo -e "${YELLOW}5.${NC} Ouvrir EXTENSION_GUIDE.md"
    echo -e "${YELLOW}6.${NC} Ouvrir PROJECT_SUMMARY.md"
    echo -e "${YELLOW}0.${NC} Retour au menu"
    echo ""
    read -p "Sélectionnez (0-6): " doc_choice
    
    case $doc_choice in
        1) cat README.md | less ;;
        2) cat GUIDE_COMPLET.md | less ;;
        3) cat CONFIG.md | less ;;
        4) cat QUICKSTART.md | less ;;
        5) cat EXTENSION_GUIDE.md | less ;;
        6) cat PROJECT_SUMMARY.md | less ;;
        0) return ;;
        *) echo -e "${RED}Option invalide${NC}" ;;
    esac
}

# Boucle principale
while true; do
    show_menu
    read -p "Sélectionnez (0-11): " choice
    
    case $choice in
        1) install_deps ;;
        2) run_app ;;
        3) run_release ;;
        4) format_code ;;
        5) analyze_code ;;
        6) run_tests ;;
        7) clean_cache ;;
        8) build_apk ;;
        9) build_ipa ;;
        10) show_logs ;;
        11) show_docs ;;
        0) echo -e "${GREEN}Au revoir!${NC}"; exit 0 ;;
        *) echo -e "${RED}Option invalide${NC}" ;;
    esac
    
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
    clear
done
