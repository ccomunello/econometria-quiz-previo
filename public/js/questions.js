/** Preguntas finales del quiz previo — Econometría UTDT */
window.QUIZ = {
  title: "Quiz previo — refresco de herramientas",
  timerSeconds: 35,
  questions: [
    {
      id: "1B",
      topic: "Estimación vs inferencia",
      prompt:
        "¿Cuál es la diferencia correcta entre <strong>estimación</strong> e <strong>inferencia</strong>?",
      options: {
        A: "Estimación = hipótesis; inferencia = promedio muestral",
        B: "Estimación = obtener \\(\\hat\\theta\\) de los datos; inferencia = usar \\(\\hat\\theta\\) (y su error) para decir algo sobre \\(\\theta\\) poblacional",
        C: "Son sinónimos en econometría",
        D: "Inferencia solo existe si hay aleatorización"
      },
      correct: "B",
      explanation:
        "La <em>estimación</em> produce un número (o vector) a partir de la muestra. La <em>inferencia</em> usa ese estimador —y su incertidumbre— para afirmar algo sobre el parámetro poblacional (tests, intervalos de confianza).",
      figure: "fig-01.svg"
    },
    {
      id: "2A",
      topic: "Contraste de hipótesis",
      prompt:
        "Queremos testear si el retorno a la educación es <strong>distinto de cero</strong> (puede ser positivo o negativo). ¿Formulación y tipo de test?",
      options: {
        A: "\\(H_0:\\beta=0\\) vs \\(H_1:\\beta\\neq 0\\) — bicaudal",
        B: "\\(H_0:\\beta=0\\) vs \\(H_1:\\beta>0\\) — unicaudal derecha",
        C: "\\(H_0:\\beta>0\\) vs \\(H_1:\\beta=0\\) — bicaudal",
        D: "\\(H_0:\\beta\\neq 0\\) vs \\(H_1:\\beta=0\\) — unicaudal"
      },
      correct: "A",
      explanation:
        "Si la alternativa admite desviaciones en ambas direcciones, \\(H_1\\) es \\(\\beta\\neq 0\\) y el rechazo se mira en <strong>ambas colas</strong> de la distribución del estadístico.",
      figure: "fig-02.svg"
    },
    {
      id: "2B",
      topic: "Contraste de hipótesis",
      prompt:
        "La teoría predice que un programa <strong>reduce</strong> el desempleo, así que solo importa evidencia de efecto negativo. ¿Cuál es correcta?",
      options: {
        A: "\\(H_0:\\beta=0\\) vs \\(H_1:\\beta<0\\) — unicaudal izquierda",
        B: "\\(H_0:\\beta=0\\) vs \\(H_1:\\beta\\neq 0\\) — bicaudal (siempre)",
        C: "\\(H_0:\\beta<0\\) vs \\(H_1:\\beta=0\\)",
        D: "No se pueden usar tests unilaterales en econometría"
      },
      correct: "A",
      explanation:
        "Cuando la teoría fija el signo del efecto, la alternativa es unilateral. Aquí solo rechazamos \\(H_0\\) con evidencia de \\(\\beta\\) negativo (cola izquierda).",
      figure: "fig-03.svg"
    },
    {
      id: "3B",
      topic: "Probabilidad",
      prompt:
        "Dos eventos independientes \\(A\\) y \\(B\\) con \\(P(A)=0{,}3\\), \\(P(B)=0{,}5\\). ¿Cuánto vale \\(P(A\\cap B)\\)?",
      options: {
        A: "\\(0{,}8\\)",
        B: "\\(0{,}2\\)",
        C: "\\(0{,}15\\)",
        D: "\\(0{,}3/0{,}5\\)"
      },
      correct: "C",
      explanation:
        "Independencia implica \\(P(A\\cap B)=P(A)\\,P(B)=0{,}3\\times 0{,}5=0{,}15\\). No se suman (eso sería una unión bajo exclusividad, y ni siquiera aplica aquí).",
      figure: "fig-04.svg"
    },
    {
      id: "4A",
      topic: "Interpretación de coeficientes",
      prompt:
        "En \\(\\widehat{\\mathrm{salario}} = 800 + 120\\cdot\\mathrm{educ}\\) (salario en \\$/mes, educ en años), el 120 significa:",
      options: {
        A: "El salario promedio es 120",
        B: "Cada año adicional de educación se asocia, en promedio, con \\$120 más de salario (en este modelo simple)",
        C: "La educación explica el 120% del salario",
        D: "\\(\\beta_0=120\\)"
      },
      correct: "B",
      explanation:
        "En un modelo en niveles, la pendiente es \\(\\Delta y/\\Delta x\\): un año más de educación se asocia con 120 unidades más de \\(y\\). El intercepto 800 es el valor predicho cuando educ \\(=0\\).",
      figure: "fig-05.svg"
    },
    {
      id: "4B",
      topic: "Interpretación de coeficientes",
      prompt:
        "En \\(\\widehat{\\log(\\mathrm{wage})} = 1{,}5 + 0{,}08\\cdot\\mathrm{educ}\\), el 0{,}08 se interpreta aproximadamente como:",
      options: {
        A: "\\$0{,}08 más de salario por año de educación",
        B: "≈ 8% más de salario por cada año adicional de educación",
        C: "8 años más de educación",
        D: "Un \\(R^2\\) de 0{,}08"
      },
      correct: "B",
      explanation:
        "Con \\(y\\) en logaritmo y \\(x\\) en niveles, \\(100\\times\\beta\\) es el cambio porcentual aproximado de \\(y\\) ante un aumento de una unidad en \\(x\\) (regla log-level).",
      figure: "fig-06.svg"
    },
    {
      id: "5B",
      topic: "Matrices (OLS)",
      prompt:
        "Si \\(X\\) es \\(n\\times k\\) e \\(y\\) es \\(n\\times 1\\), ¿cuál es la dimensión de \\(X'y\\)?",
      options: {
        A: "\\(n\\times n\\)",
        B: "\\(n\\times 1\\)",
        C: "\\(k\\times 1\\)",
        D: "\\(k\\times k\\)"
      },
      correct: "C",
      explanation:
        "\\(X'\\) es \\(k\\times n\\). Multiplicar por \\(y\\) (\\(n\\times 1\\)) da un vector \\(k\\times 1\\). Ese vector aparece en la fórmula \\(\\hat\\beta=(X'X)^{-1}X'y\\).",
      figure: "fig-07.svg"
    },
    {
      id: "5F",
      topic: "Matrices (OLS)",
      prompt:
        "Si \\(X'X\\) es invertible, ¿cuánto vale el producto \\(X'X\\,(X'X)^{-1}\\)?",
      options: {
        A: "\\(X\\)",
        B: "\\(X'\\)",
        C: "\\(0\\) (matriz nula)",
        D: "\\(I\\) (la matriz identidad)"
      },
      correct: "D",
      explanation:
        "Por definición de inversa: si \\(A=X'X\\) es invertible, entonces \\(A A^{-1}=I\\). No hace falta conocer los números dentro de \\(X\\).",
      figure: "fig-08.svg"
    },
    {
      id: "5G",
      topic: "Matrices (OLS)",
      prompt:
        "Si \\(X'X\\) es invertible, ¿cuál afirmación es verdadera?",
      options: {
        A: "\\((X'X)^{-1}X'X = X'X\\,(X'X)^{-1} = I\\)",
        B: "\\(X'X\\,(X'X)^{-1} = X\\)",
        C: "\\((X'X)^{-1} = XX'\\) siempre",
        D: "\\(X'X\\,(X'X)^{-1} = 0\\)"
      },
      correct: "A",
      explanation:
        "La inversa “cancela” a izquierda y a derecha: ambos productos dan la identidad \\(I_k\\). \\(XX'\\) es otra matriz (\\(n\\times n\\)) y no es, en general, la inversa de \\(X'X\\).",
      figure: "fig-09.svg"
    },
    {
      id: "5H",
      topic: "Matrices (OLS)",
      prompt:
        "Si \\(X\\) es \\(n\\times k\\), la traspuesta \\(X'\\) (o \\(X^{\\mathsf{T}}\\)):",
      options: {
        A: "Tiene las mismas dimensiones \\(n\\times k\\) y los mismos elementos",
        B: "Es \\(k\\times n\\): sus filas son las columnas de \\(X\\) (y viceversa)",
        C: "Es siempre \\(k\\times k\\)",
        D: "Es la inversa de \\(X\\)"
      },
      correct: "B",
      explanation:
        "Trasponer intercambia filas por columnas. Las dimensiones pasan de \\(n\\times k\\) a \\(k\\times n\\). No es lo mismo que invertir.",
      figure: "fig-10.svg"
    },
    {
      id: "5I",
      topic: "Matrices (OLS)",
      prompt:
        "¿Cuál identidad es siempre verdadera (dimensiones compatibles)?",
      options: {
        A: "\\((X'X)' = X'X\\) (es simétrica)",
        B: "\\((X'X)' = XX'\\)",
        C: "\\(X' = X^{-1}\\)",
        D: "\\((AB)' = A'B'\\)"
      },
      correct: "A",
      explanation:
        "\\((X'X)'=X''(X')'=X'X\\), así que \\(X'X\\) es simétrica. Cuidado: la regla correcta del producto es \\((AB)'=B'A'\\), no \\(A'B'\\).",
      figure: "fig-11.svg"
    }
  ]
};
