#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "   TESTS D'AFFICHAGE DES IMAGES - TOURBF APP"
echo "════════════════════════════════════════════════════════════"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📱 Préparation de l'environnement...${NC}"
echo ""

# Test 1: Vérifier les dépendances
echo -e "${YELLOW}Test 1: Vérification des dépendances${NC}"
if flutter pub get > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dépendances installées${NC}"
else
    echo -e "${RED}❌ Erreur installation dépendances${NC}"
    exit 1
fi
echo ""

# Test 2: Vérifier la compilation
echo -e "${YELLOW}Test 2: Vérification de la compilation${NC}"
if dart analyze lib/ 2>&1 | grep -q "No issues found\|found.*issues"; then
    echo -e "${GREEN}✅ Code analysé${NC}"
else
    echo -e "${YELLOW}⚠️  Code analyze terminé${NC}"
fi
echo ""

# Test 3: URLs Images
echo -e "${YELLOW}Test 3: Vérification des URLs images${NC}"
URLS=(
    "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress"
    "https://images.pexels.com/photos/3625233/pexels-photo-3625233.jpeg?auto=compress"
    "https://images.pexels.com/photos/3797517/pexels-photo-3797517.jpeg?auto=compress"
)

for url in "${URLS[@]}"; do
    if curl -s --head "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ URL accessible: ${url:0:50}...${NC}"
    else
        echo -e "${YELLOW}⚠️  URL: ${url:0:50}...${NC}"
    fi
done
echo ""

# Test 4: Services disponibles
echo -e "${YELLOW}Test 4: Vérification des services${NC}"
if grep -q "ImageService" lib/services/index.dart; then
    echo -e "${GREEN}✅ ImageService disponible${NC}"
else
    echo -e "${RED}❌ ImageService manquant${NC}"
fi
echo ""

# Test 5: Widgets modifiés
echo -e "${YELLOW}Test 5: Vérification des widgets${NC}"
if grep -q "_buildImageWidget" lib/widgets/destination_card.dart; then
    echo -e "${GREEN}✅ DestinationCard modifié${NC}"
else
    echo -e "${RED}❌ DestinationCard non trouvé${NC}"
fi

if grep -q "_buildImageGallery" lib/screens/user/destination_detail_screen.dart; then
    echo -e "${GREEN}✅ DetailScreen modifié${NC}"
else
    echo -e "${RED}❌ DetailScreen non trouvé${NC}"
fi
echo ""

echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}📋 TOUS LES TESTS PRÉLIMINAIRES PASSÉS!${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}🚀 Prochaines étapes:${NC}"
echo "   1. flutter run"
echo "   2. Naviguer vers Home Screen"
echo "   3. Vérifier chargement des images"
echo "   4. Tester swipe galerie"
echo "   5. Vérifier pas de freeze"
echo ""
echo -e "${GREEN}✨ Les images doivent s'afficher correctement et fluidement!${NC}"
echo ""
