function calcular() {
    const nome = document.getElementById('nome').value;
    const disciplina = document.getElementById('disciplina').value;

    const nota1 = Number(document.getElementById('nota1').value);
    const nota2 = Number(document.getElementById('nota2').value);
    const nota3 = Number(document.getElementById('nota3').value);
    const nota4 = Number(document.getElementById('nota4').value);

    const media = (nota1 + nota2 + nota3 + nota4) / 4;

    document.getElementById('nomeD').innerHTML =  nome;
    document.getElementById('disciplinaD').innerHTML =   disciplina;
    document.getElementById('notas').innerHTML =  nota1 + " • " + nota2 + " • " + nota3 + " • " + nota4;
    document.getElementById('media').innerHTML = media}