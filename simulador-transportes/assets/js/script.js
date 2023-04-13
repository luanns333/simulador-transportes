$(document).ready(() => {
    $('#cotationBtn').on('click', startCotation)
    $('#backBtn').on('click', backButton)
    $('#forwardBtn').on('click', validateCities)
    $('#finishBtn').on('click', validateProducts)
    $('#backToStartBtn').on('click', backToStart)
    $('#reportBtn').on('click', report)
    $('#contactInfo').on('click', contact)
    $('#closeContactInfo').on('click', closeContact)
});

const startCotation = () => {
    $('#home').hide('slow');
    $('#chooseCities').show('slow');
    $('#forwardBtn').show('slow');
    $('#finishBtn').hide('slow');
}

const backButton = () => {
    $('#chooseCities').hide('slow');
    $('#chooseProducts').hide('slow');
    $('#home').show('slow');
    $('#forwardBtn').show('slow');
    $('#finishBtn').hide('slow');
}

const validateCities = () => {
    if( $('#originCity').val() == 0 && $('#destinationCity').val() == 0) {
        toastr.error('Por favor, selecione cidades de origem e destino');
    }
    else if ($('#originCity').val() == 0) {
        toastr.error('Por favor, selecione cidade de origem');
    }
    else if ($('#destinationCity').val() == 0) {
        toastr.error('Por favor, selecione cidade de destino');
    }
    else if ($('#originCity').val() == $('#destinationCity').val()) {
        toastr.error('Por favor, selecione cidades diferentes');
    }
    else {
    $('#chooseProducts').show('slow');
    $('#forwardBtn').hide('slow');
    $('#finishBtn').show('slow');
    }
}

const validateProducts = () => {
    let input1 = $('.inputProducts1').val();
    let input2 = $('.inputProducts2').val();
    let input3 = $('.inputProducts3').val();
    let input4 = $('.inputProducts4').val();
    input1 = parseInt(input1);
    input2 = parseInt(input2);
    input3 = parseInt(input3);
    input4 = parseInt(input4);

    if (input1 < 0 || input2 < 0 || input3 < 0 || input4 < 0) {
        toastr.error('Valor inválido! Por favor, digite 0 ou um número inteiro positivo');
        $('.inputProducts1').val('');
        $('.inputProducts2').val('');
        $('.inputProducts3').val('');
        $('.inputProducts4').val('');
    }
    else if (input1 >= 0 && input2 >= 0 && input3 >= 0 && input4 >= 0) {
        $('#chooseCities').hide('slow');
        $('#chooseProducts').hide('slow');
        $('#finalQuotation').show('slow');
        toastr.success('Cotação realizada com sucesso!');
        cotation();
    }
    else {
        toastr.error('Valor inválido!');
        $('.inputProducts1').val('');
        $('.inputProducts2').val('');
        $('.inputProducts3').val('');
        $('.inputProducts4').val('');
    }
}

const backToStart = () => {
    $('#finalQuotation').hide('slow');
    $('#home').show('slow');
    resetForm();
}

const resetForm = () => {
    $('#originCity').val(0) && $('#destinationCity').val(0);
    $('.inputProducts1').val('');
    $('.inputProducts2').val('');
    $('.inputProducts3').val('');
    $('.inputProducts4').val('');
    $('#resume').remove();
    $('#modalReport').remove();
}

// Botão de relatório
const report = () => {
    let refrigeratorQty = $('.inputProducts1').val();
    let freezerQty = $('.inputProducts2').val();
    let ovenQty = $('.inputProducts3').val();
    let washingQty = $('.inputProducts4').val();
    let totalWeight = (refrigeratorQty*weights.refrigerator) + (freezerQty*weights.freezer) + (ovenQty*weights.oven) + (washingQty*weights.washing);
    let smallTruck = Math.ceil(totalWeight / trucks.small.capacity);
    let mediumTruck = Math.ceil(totalWeight / trucks.medium.capacity);
    let largeTruck = Math.ceil(totalWeight / trucks.large.capacity);
    return {
        smallTruck, mediumTruck, largeTruck
    }
}

const cotation = () => {
    let distancesBetweenCities = distances($('#originCity').val())[$('#destinationCity').val()];
    let {smallTruck, mediumTruck, largeTruck} = report();

    // Custo por cada tipo de caminhão (relatório)
    let costSmallTruck = distancesBetweenCities*trucks.small.cost;
    let costMediumTruck = distancesBetweenCities*trucks.medium.cost;
    let costLargeTruck = distancesBetweenCities*trucks.large.cost;

    // Peso total dos produtos (relatório)
    let totalWeightRefrigerator = $('.inputProducts1').val() * weights.refrigerator;
    let totalWeightFreezer = $('.inputProducts2').val() * weights.freezer;
    let totalWeightOven = $('.inputProducts3').val() * weights.oven;
    let totalWeightWashing = $('.inputProducts4').val()*weights.washing;

    // Custo total
    let totalCostSmallTrucks = costSmallTruck*smallTruck;
    let totalCostMediumTruck = costMediumTruck*mediumTruck;
    let totalCostLargeTruck = costLargeTruck*largeTruck;

    const result = `<div id="resume"><br>
    De ${$('#originCity').val()} até ${$('#destinationCity').val()}: distância de ${distancesBetweenCities} km.<br><br>
    Serão necessários:<br>
    Caminhão de porte pequeno: ${smallTruck}<br>
    ou <br>
    Caminhão de porte médio: ${mediumTruck}<br>
    ou <br>
    Caminhão de porte grande: ${largeTruck}<br><br>

    Custo total caminhões porte pequeno: R$ ${totalCostSmallTrucks.toFixed(2).replace('.', ',')}<br>
    Custo total caminhões porte médio: R$ ${totalCostMediumTruck.toFixed(2).replace('.', ',')}<br>
    Custo total caminhões porte grande: R$ ${totalCostLargeTruck.toFixed(2).replace('.', ',')}<br></div>`

    $('#result').append(result);

    // Relatório da cotação
    let modalReport = `<div id="modalReport">
    Cidade de origem: ${$('#originCity').val()} <br>
    Cidade de destino: ${$('#destinationCity').val()} <br>
    Distância a ser percorrida: ${distancesBetweenCities} km <br>
    Geladeira: ${$('.inputProducts1').val()} unidade(s); <br>
    Freezer: ${$('.inputProducts2').val()} unidade(s); <br>
    Fogão: ${$('.inputProducts3').val()} unidade(s);<br>
    Máquina de lavar: ${$('.inputProducts4').val()} unidade(s)<br>
    Peso total geladeiras: ${totalWeightRefrigerator} kg<br>
    Peso total freezers: ${totalWeightFreezer} kg<br>
    Peso total fogões: ${totalWeightOven} kg<br>
    Peso total máquinas de lavar: ${totalWeightWashing} kg<br>
    Valor por cada caminhão de porte pequeno: R$ ${costSmallTruck.toFixed(2).replace('.', ',')}<br>
    Valor por cada caminhão de porte médio: R$ ${costMediumTruck.toFixed(2).replace('.', ',')}<br>
    Valor por cada caminhão de porte grande: R$ ${costLargeTruck.toFixed(2).replace('.', ',')}<br></div>`

    $('.modal-body').append(modalReport);
};

// Modal de contato
const contact = () => {
        $('#contact').show('slow');
    }

const closeContact = () => {
    $('#contact').hide('slow')
}