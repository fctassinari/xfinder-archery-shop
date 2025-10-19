# XFinder Archery DB

```bash
podman volume create vl-xfinder-postgres

podman run --name xfinder-postgres -p 5432:5432 -e POSTGRES_PASSWORD=XF@2025 --volume vl-xfinder-postgres:/var/lib/postgresql -d postgres:18.0

```
```
-- Database: xfa

-- DROP DATABASE IF EXISTS xfa;

CREATE DATABASE xfa
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
```

```
JSON para criar os produtos principais:
1. X-Puller
json
{
  "name": "X-Puller",
  "price": 70.0,
  "image": "x-puller.png",
  "description": "Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e eficiência.",
  "weight": 0.066,
  "height": 1.5,
  "width": 8.0,
  "length": 8.0,
  "category": "Acess. Flechas",
  "rating": 4.9,
  "reviews": 127,
  "originalPrice": 85.00,
  "isNew": false,
  "inStock": true,
  "quantity": 30,
  "features": ["Grip antideslizante", "Material durável", "Design ergonômico"]
}
2. X-Lube
json
{
  "name": "X-Lube",
  "price": 70.0,
  "image": "x-lube.jpg",
  "description": "Silicone para diminuir o esforço de extrair a flecha do alvo.",
  "weight": 0.07,
  "height": 3.0,
  "width": 3.0,
  "length": 13.0,
  "category": "Acess. Flechas",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 20,
  "features": ["Alta Viscosidade", "Fácil Utilização", "Rende mais tiros entre utilização"]
}
3. X-Nock Adapter - 3 mm
json
{
  "name": "X-Nock Adapter - 3 mm",
  "price": 80.0,
  "image": "x-na-protour.jpg",
  "description": "Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha",
  "weight": 0.036,
  "height": 2.0,
  "width": 0.3,
  "length": 3.6,
  "category": "Acess. Flechas",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 10,
  "features": ["Feito em Alumínio", "Adequado para flechas Protour / X10", "Ou em tubos com 3 mm de diâmetro interno", "12 unidades"]
}
4. X-Nock Adapter - 5 mm
json
{
  "name": "X-Nock Adapter - 4 mm",
  "price": 80.0,
  "image": "x-na-ace.jpg",
  "description": "Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha",
  "weight": 0.072,
  "height": 2.0,
  "width": 0.4,
  "length": 4.8,
  "category": "Acess. Flechas",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 10,
  "features": ["Feito em Alumínio", "Adequado para flechas ACE", "Ou em tubos com 4 mm de diâmetro interno", "12 unidades"]
}
5. X-Nock Adapter - 7 mm
json
{
  "name": "X-Nock Adapter - 6 mm",
  "price": 80.0,
  "image": "x-na-x7.jpg",
  "description": "Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha",
  "weight": 0.096,
  "height": 2.0,
  "width": 0.6,
  "length": 7.2,
  "category": "Acess. Flechas",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 10,
  "features": ["Feito em Alumínio", "Adequado para flechas X7 2314", "Ou em tubos com 6 mm de diâmetro interno", "12 unidades"]
}
6. X-Nock Adapter - 8 mm
json
{
  "name": "X-Nock Adapter - 8 mm",
  "price": 80.0,
  "image": "x-na-x23.jpg",
  "description": "Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha",
  "weight": 0.144,
  "height": 2.0,
  "width": 0.8,
  "length": 9.6,
  "category": "Acess. Flechas",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 10,
  "features": ["Feito em Alumínio", "Adequado para flechas X23 2314 / 2315", "Ou em tubos com 8 mm de diâmetro interno", "12 unidades"]
}
7. Chave Allen
json
{
  "name": "Chave Allen",
  "price": 80.0,
  "image": "x-allen.jpg",
  "description": "Jogo de chaves Allen canivete com 7 medidas em milímetros e 7 medidas em polegadas",
  "weight": 0.237,
  "height": 3.0,
  "width": 4.0,
  "length": 11.0,
  "category": "Ferramentas",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 10,
  "features": ["6 mm", "5 mm", "4 mm", "3 mm", "2,5 mm", "2 mm", "1,5 mm", "1/4 pol", "3/16 pol", "5/32 pol", "1/8 pol", "3/32 pol", "5/64 pol", "1/16 pol"]
}
8. X-Dumper Sight
json
{
  "name": "X-Dumper Sight",
  "price": 120.0,
  "image": "x-dumper-sight.jpg",
  "description": "Dumper para eliminar a vibração na haste da mira",
  "weight": 0.38,
  "height": 3.5,
  "width": 1.5,
  "length": 3.5,
  "category": "Acess. Mira",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 3,
  "features": ["Corpo de Borracha", "Peso em aço inox", "Vendido em pares"]
}
9. X-VBar
json
{
  "name": "X-VBar",
  "price": 130.0,
  "image": "x-vbar.jpg",
  "description": "VBar em alumínio para estabilizadores",
  "weight": 0.55,
  "height": 2.0,
  "width": 2.5,
  "length": 8.0,
  "category": "Acess. Estabilização",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 2,
  "features": ["Em Alumínio", "Leve", "Resistente"]
}
10. X-Pin Branco
json
{
  "name": "X-Pin Branco",
  "price": 5.0,
  "image": "x-pin-branco.jpg",
  "description": "Grampo para fixação de alvo",
  "weight": 0.003,
  "height": 2.0,
  "width": 2.0,
  "length": 3.0,
  "category": "Acess. Alvo",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 16,
  "features": ["Resistente", "Não destroi a flecha"]
}
11. X-Pin Amarelo
json
{
  "name": "X-Pin Amarelo",
  "price": 5.0,
  "image": "x-pin-amarelo.jpg",
  "description": "Grampo para fixação de alvo",
  "weight": 0.003,
  "height": 2.0,
  "width": 2.0,
  "length": 3.0,
  "category": "Acess. Alvo",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 22,
  "features": ["Resistente", "Não destroi a flecha"]
}
12. X-Pin Cinza
json
{
  "name": "X-Pin Cinza",
  "price": 5.0,
  "image": "x-pin-cinza.jpg",
  "description": "Grampo para fixação de alvo",
  "weight": 0.003,
  "height": 2.0,
  "width": 2.0,
  "length": 3.0,
  "category": "Acess. Alvo",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 115,
  "features": ["Resistente", "Não destroi a flecha"]
}
13. X-Pin Azul
json
{
  "name": "X-Pin Azul Esverdeado",
  "price": 5.0,
  "image": "x-pin-azul.jpg",
  "description": "Grampo para fixação de alvo",
  "weight": 0.003,
  "height": 2.0,
  "width": 2.0,
  "length": 3.0,
  "category": "Acess. Alvo",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 78,
  "features": ["Resistente", "Não destroi a flecha"]
}
14. X-Pin Hard Core
json
{
  "name": "X-Pin Hard Core",
  "price": 8.0,
  "image": "x-pin-hc.jpg",
  "description": "Grampo para fixação de alvo",
  "weight": 0.006,
  "height": 2.0,
  "width": 2.0,
  "length": 7.0,
  "category": "Acess. Alvo",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 78,
  "features": ["Resistente", "Não destroi a flecha"]
}
15. X-Tap (produto principal)
json
{
  "name": "X-Tap",
  "price": 2.0,
  "image": "x-tap.jpg",
  "description": "Adesivos temáticos",
  "weight": 0.006,
  "height": 0.1,
  "width": 3.0,
  "length": 3.0,
  "category": "Adesivos",
  "rating": 4.8,
  "reviews": 89,
  "originalPrice": null,
  "isNew": false,
  "inStock": true,
  "quantity": 16,
  "features": ["Lindos", "Variados", "Colecionáveis"],
  "variants": [
    {
      "name": "X-Tap - Cavalete",
      "price": 2.0,
      "image": "x-tap-cavalete.jpg",
      "description": "Adesivos temáticos",
      "weight": 0.006,
      "height": 0.1,
      "width": 3.0,
      "length": 3.0,
      "category": "Adesivos",
      "rating": 4.8,
      "reviews": 89,
      "originalPrice": null,
      "isNew": false,
      "inStock": true,
      "quantity": 2,
      "features": ["Lindos", "Variados"]
    },
    {
      "name": "X-Tap - Arqueira",
      "price": 2.0,
      "image": "x-tap-arqueira.jpg",
      "description": "Adesivos temáticos",
      "weight": 0.006,
      "height": 0.1,
      "width": 3.0,
      "length": 3.0,
      "category": "Adesivos",
      "rating": 4.8,
      "reviews": 89,
      "originalPrice": null,
      "isNew": false,
      "inStock": true,
      "quantity": 4,
      "features": ["Lindos", "Variados"]
    },
    {
      "name": "X-Tap - Arco",
      "price": 2.0,
      "image": "x-tap-arco.jpg",
      "description": "Adesivos temáticos",
      "weight": 0.006,
      "height": 0.1,
      "width": 3.0,
      "length": 3.0,
      "category": "Adesivos",
      "rating": 4.8,
      "reviews": 89,
      "originalPrice": null,
      "isNew": false,
      "inStock": true,
      "quantity": 5,
      "features": ["Lindos", "Variados"]
    },      
    {
      "name": "X-Tap - Alvo",
      "price": 2.0,
      "image": "x-tap-alvo.jpg",
      "description": "Adesivos temáticos",
      "weight": 0.006,
      "height": 0.1,
      "width": 3.0,
      "length": 3.0,
      "category": "Adesivos",
      "rating": 4.8,
      "reviews": 89,
      "originalPrice": null,
      "isNew": false,
      "inStock": true,
      "quantity": 5,
      "features": ["Lindos", "Variados"]
    }      
  ]  
}
16. X-Tap - Cavalete
json

17. X-Tap - Arqueira
json

18. X-Tap - Arco
json

19. X-Tap - Alvo
json

```