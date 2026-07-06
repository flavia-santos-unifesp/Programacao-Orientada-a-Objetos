#!/bin/bash

echo "=== Testing Dynamic Service Pricing Endpoint ==="
echo ""

# Test 1: Agnes (3.4kg, PEQUENO) - BANHO should be R$ 40
echo "Test 1: Agnes (3.4kg) - BANHO"
curl -s "http://localhost:3000/api/servicos/preco/3/BANHO" | grep -o '"preco":[0-9]*'
echo ""

# Test 2: Matilda (5.5kg, PEQUENO) - BANHO should be R$ 60
echo "Test 2: Matilda (5.5kg) - BANHO"
curl -s "http://localhost:3000/api/servicos/preco/2/BANHO" | grep -o '"preco":[0-9]*'
echo ""

# Test 3: Leon (9.2kg, MÉDIO) - BANHO should be R$ 60
echo "Test 3: Leon (9.2kg) - BANHO"
curl -s "http://localhost:3000/api/servicos/preco/1/BANHO" | grep -o '"preco":[0-9]*'
echo ""

# Test 4: Agnes - TOSA should be R$ 50 (PEQUENO)
echo "Test 4: Agnes - TOSA (PEQUENO)"
curl -s "http://localhost:3000/api/servicos/preco/3/TOSA" | grep -o '"preco":[0-9]*'
echo ""

# Test 5: Leon - TOSA should be R$ 80 (MÉDIO)
echo "Test 5: Leon - TOSA (MÉDIO)"
curl -s "http://localhost:3000/api/servicos/preco/1/TOSA" | grep -o '"preco":[0-9]*'
echo ""

# Test 6: Any pet - CONSULTA should be R$ 120 (fixed)
echo "Test 6: Agnes - CONSULTA (fixed price)"
curl -s "http://localhost:3000/api/servicos/preco/3/CONSULTA" | grep -o '"preco":[0-9]*'
echo ""

echo "=== All tests completed ==="
