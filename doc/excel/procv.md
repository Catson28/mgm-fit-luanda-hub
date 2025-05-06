Claro! Aqui vai um **programa de estudo completo de PROCV (VLOOKUP)** com **exemplos claros**, organizado passo a passo — desde o básico até os níveis mais avançados — usando uma linguagem simples e direta, como se estivéssemos a conversar.

---

## 📘 **PROGRAMA DE ESTUDO - PROCV (VLOOKUP) no Excel**

### 🟢 1. Introdução ao PROCV

> Entender o que é, para que serve e quando usar.

* **Objetivo:** Saber procurar informações numa tabela.
* **Sintaxe básica:**

  ```
  =PROCV(valor_procurado; tabela; número_coluna; [procurar_intervalo])
  ```
* **Exemplo:**

  ```excel
  =PROCV("João"; A2:B10; 2; FALSO)
  ```

  👉 Vai procurar "João" na primeira coluna da tabela A2\:B10 e trazer o dado da **2ª coluna** na mesma linha.

---

### 🟡 2. Casos Práticos Básicos

> Usar com tabelas de vendas, funcionários, alunos, etc.

* **Exemplo 1: Tabela de produtos e preços**

  | Produto | Preço |
  | ------- | ----- |
  | Arroz   | 1500  |
  | Feijão  | 1000  |

  Fórmula:

  ```excel
  =PROCV("Feijão"; A2:B4; 2; FALSO)
  👉 Retorna: 1000
  ```

* **Exemplo 2: Boletim de Notas**
  Procurar a nota do aluno pelo nome.

---

### 🟠 3. Uso com Referência a Células

> Torna a fórmula dinâmica.

* Em vez de escrever "Feijão" direto, usa:

  ```excel
  =PROCV(D2; A2:B10; 2; FALSO)
  ```

  👉 Assim, se escreveres outro nome na célula D2, a fórmula muda o resultado automaticamente.

---

### 🔵 4. PROCV com Colunas em Outra Planilha

> Buscar dados de outra aba ou planilha.

* Exemplo:

  ```excel
  =PROCV("Carlos"; 'Funcionários'!A2:C100; 3; FALSO)
  ```

  👉 Procura "Carlos" na aba "Funcionários" e traz a informação da 3ª coluna.

---

### 🔴 5. PROCV com Erros: Usar SEERRO

> Corrigir quando o valor não é encontrado.

* Fórmula com tratamento de erro:

  ```excel
  =SEERRO(PROCV("Teste"; A2:B10; 2; FALSO); "Não encontrado")
  ```

  👉 Em vez de mostrar erro (#N/D), mostra "Não encontrado".

---

### 🟣 6. PROCV + CORRESP

> Quando a coluna do valor desejado pode mudar (dinâmico).

* Em vez de fixar o número da coluna, usa:

  ```excel
  =PROCV("João"; A2:D10; CORRESP("Nota"; A1:D1; 0); FALSO)
  ```

  👉 Vai procurar a coluna onde está escrito "Nota" e usar como índice do PROCV.

---

### ⚫ 7. Limitações do PROCV (e como contornar)

> PROCV só procura da esquerda pra direita. Não dá pra procurar ao contrário.

* Para isso, usa **ÍNDICE + CORRESP**, ou aprende o **PROCX (XLOOKUP)**.

---

### 🟤 8. PROCV Avançado (Exercícios Combinados)

> Simular sistemas com várias tabelas cruzadas, cadastros automáticos, geração de relatórios.

* Exemplo:

  * Preencher dados de clientes automaticamente ao digitar o código.
  * Simular um sistema de estoque que busca preço e quantidade automaticamente com PROCVs diferentes.

---

### 🧠 DICAS EXTRAS

* Sempre usa `FALSO` no final da fórmula para uma **busca exata**.
* Usa **tabelas nomeadas** (Ctrl + T) para tornar mais limpo.
* O **PROCX (XLOOKUP)** é mais moderno e substitui o PROCV, mas nem todas versões do Excel têm.

---

Queres que eu crie um ficheiro Excel com todos esses exemplos prontos pra praticar?
