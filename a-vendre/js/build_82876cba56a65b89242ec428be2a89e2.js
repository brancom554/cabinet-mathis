/* *concat build_moteur.prd2.js* */
var model = $('script[id=moteurJS]').attr('data-model');
function isVarDefined(myVar){    
    if (typeof myVar == "undefined" || myVar == null) {
      return false;
    } else {
      return true;
    }
}
$(document).ready(function(){

    if($('#search2').length){
		var scrollElemToWatch_1 = document.getElementById('search2');
		var watcher_1 = scrollMonitor.create(scrollElemToWatch_1, -150);
                if(isVarDefined(document.querySelector('#rev1'))){
                   var rev1 = new RevealFx(document.querySelector('#rev1'), {
                            revealSettings : {
                                    bgcolor: $('.moteur2 .btn-primary').css('background-color'),
                                    direction: 'rl',
                                    onCover: function(contentEl, revealerEl) {
                                            contentEl.style.opacity = 1;
                                    }
                            }
                    });
                } else {
                    var rev1 = null;
                }
		watcher_1.enterViewport(function() {
			if(isVarDefined(rev1)){rev1.reveal();}
			watcher_1.destroy();
		});
    }

    /**
        Evenement pour Select
    **/
    if ($('#inputOffredem').length){
        $("body").on("change", "#inputOffredem", function() {
            var typeOffre = $(this).val();
            if (typeOffre){
                $(".containerSearch").load(getBase() + 'search/engine/' + typeOffre, function(data){
                    $(".containerSearch").html(data);
                    initSelectPicker();
                    UpdateVille();
                    advancedSearch();
                    datePickerHc();
                    if($(".moteur1").hasClass('hidden')){
                        $(".moteur1").fadeToggle( "fast", "linear" );
                        $(".moteur1").removeClass('hidden');
                        if(isVarDefined(document.querySelector('#rev1'))){
                            var rev2 = new RevealFx(document.querySelector('#rev1'), {
                                revealSettings : {
                                    bgcolor: $('.moteur1 h1').css('color'),
                                    delay: 250,
                                    onCover: function(contentEl, revealerEl) {
                                        contentEl.style.opacity = 1;
                                    }
                                }
                            });
                        } else {
                            var rev2 = null;
                        }
                        if(isVarDefined(rev2)){rev2.reveal();}
                    }
                });
            }
        });
    } else {
        if ($('#AllItemlocalisation').length && !$('.containerSearch .list-offre').length){
            autocompleteAllItemLocalisation();
        }
        UpdateVille();
    }
    /**
        Evenement pour Onglet
    **/
    if ($('.containerSearch .list-offre').length){

        var nbActive = $('.containerSearch .list-offre li.active').length;
        if (nbActive < 1 ) {
            $('.containerSearch .list-offre li:first').addClass('active');
        }

        var typeOffre = $('.containerSearch .list-offre li.active a').attr('href');
        if (typeOffre){
            loadEngine(typeOffre);
        }
        $(".containerSearch").on("click", ".list-offre li a", function(e) {
            e.preventDefault();
            typeOffre = $(this).attr('href');
            loadEngine(typeOffre);
        });

    }
});
function loadEngineSecteurByDep(type){    
    $.ajax({
           url: getBase() + 'search/engine-dep-secteur/',
           data: $('.containerSearch.v2').serialize(),
           type : 'POST',                       
           beforeSend: function() {
               console.log('load element');
           },
           success: function(response) {
            if (type == "dep") {
                var inputSecteur =  $(response).find('#inputSecteur').html();
                $("#inputSecteur").html(inputSecteur); 
                $('#inputSecteur.selectpicker').selectpicker('refresh');
            } else {
                if (type == "secteur") {
                    var inputDepartements =  $(response).find('#inputDepartements').html();
                    $("#inputDepartements").html(inputDepartements);
                    $('#inputDepartements.selectpicker').selectpicker('refresh');
                }
            }
           },
           complete :function() {
               console.log("Complete");
           },
           error: function() {
                console.log("Failed!");
           }
     });
    
}

function ZoneSecteurComportement(endpoint, change, clue)
{
    $.ajax(getBase() + 'i/json/' + endpoint).done(function (zones) {
        var secteurs = [];
        zones.map(function (zone) {
            zone.secteurs.map(function (secteur) {
                if (!secteurs[secteur.id]) {
                  secteurs[secteur.id] = $.extend({}, secteur, {zones: []});
                }
                if (secteurs[secteur.id].zones.indexOf(zone.o) < 0) {
                  secteurs[secteur.id].zones.push(zone.o);
                }
            });
        });

        var objectOnly = zones.map(function (zone) {
          return zone.o;
        });
        reinitFieldsDepSecteurs(objectOnly, secteurs, clue);
        var changeData = getChangeData(zones, secteurs, change, clue);
        changeData.map(function (data) {
            $(document).on('change', data.change, function () {
               var currentValue = $(this).val();
                if (currentValue === 'void' || !currentValue) {
                 reinitFieldDepSecteurs(data.reinit, data.all);
               } else {
                 reinitFieldDepSecteurs(data.reinit, data.getter(currentValue));
               }
            });
        });
    });
}

function getChangeData(zones, secteurs, change, clue)
{
    return [
      {
        change: '#inputSecteur',
        reinit: clue,
        all: zones.map(function (zone){ return zone.o; }),
        getter: function (value) {
            var tempzones = [];
            if (value == null || value === ['void']) {
                return zones.map(function (zone){ return zone.o; });
            }
            value.map(function (idSecteur) {
                if (idSecteur === 'void') {
                    return false;
                }
              secteurs[idSecteur].zones.map(function (zone) {
                  if (tempzones.indexOf(zone) < 0) {
                    tempzones.push(zone);
                  }
              });
            });
            return tempzones;
        }
      },
      {
        change: change,
        reinit: 'Secteur',
        all: secteurs,
        getter: function (value) {
          return zones.filter(function (o) {
            if (Array.isArray(value)) {
              return value.indexOf(o.o.isoCode) > -1;
            }
            return o.o.isoCode === value;
          }).map(function (o) {
            return o.secteurs;
          }).reduce(function (acc, val) {
            return acc.concat(val)
          }, []);
        }
      }
    ];
}

function reinitFieldDepSecteurs(clue, values)
{
    var selecteds = [];
    $('#input'+clue+' option:selected').each(function () {
        selecteds.push($(this).val());
    });
  $('#input'+clue+' option[value!="void"]').remove();
  fillDepSecteur(clue, values, function (o) {
      if ('isoCode' in o) {
        return [o.isoCode, o.humanName, selecteds.indexOf(""+o.isoCode) > -1];
      } else {
        return [o.id, o.nom, selecteds.indexOf(""+o.id) > -1];
      }
  });
}
function reinitFieldsDepSecteurs(zones, secteurs, clue)
{
    var toIterate = [
      {clue: 'Secteur', values: secteurs},
      {clue: clue, values: zones}
    ];
    toIterate.map(function (obj) {
      reinitFieldDepSecteurs(obj.clue, obj.values);
    });
}

function fillDepSecteur(clue, values, retriever)
{
  var container = $('#input'+clue);
  values.map(function(value) {
    var option = $('<option/>');
    var data = retriever(value);
    option.val(data[0]);
    option.text(data[1]);
    option.prop('selected', data[2]);
    container.append(option);
  });
  $('#input'+clue+'.selectpicker').selectpicker('refresh');
}

function depSecteurComportement() {
  ZoneSecteurComportement('getDepSecteurs', '#inputDepartements', 'Departements');
}
function regSecteurComportement() {
  ZoneSecteurComportement('getRegSecteurs', '#inputRegions', 'Regions');
}
function getValueOffredem(){
    var offredem = null;    
    var inputOffredem = $('input[name="data[Search][offredem]"]');
    var selectOffredem = $('select[name="data[Search][offredem]"]');
    if(isVarDefined(inputOffredem) && inputOffredem.length > 0 ) {
         offredem = inputOffredem.val();
    }
    if(isVarDefined(selectOffredem) && selectOffredem.length > 0 ) {
         offredem = selectOffredem.val();
    }
    return offredem;
}
function UpdateVille(){
    var selectVilleSecteurOptionValue = [];
     function getVilleBySecteurs(secteurs,offredem) { 
        var baseUrl = window.location.hostname;
        if(isVarDefined(offredem)) {
            var urloffre = '&offredem='+offredem;
        } else {
            var urloffre = '';
        }
        var jsonUrlVilleBySecteurs = "//"+baseUrl+'/i/json/getVillesForSearchByParams?secteurs='+secteurs+urloffre;
        return $.getJSON(jsonUrlVilleBySecteurs)
                .fail(function(data) { 
                    if(isVarDefined(secteurs)) {
                        $('select[name="data[Search][idvillecode][]"]').html('');
                        $('select[name="data[Search][idvillecode][]"]').selectpicker('refresh');
                    }
                })
                .success(function(data) { console.log("success jsonUrlVilleBySecteurs  data"); })
          .then(function( data ) {
                $.each( data, function( i, item ) {                 
                    selectVilleSecteurOptionValue.push( '<option value="'+i+'">'+item+'</option>' );
                });
             return selectVilleSecteurOptionValue;
          });
    }
    $('select[name="data[Search][secteurs][]"]').change(function() {                
        var selectedSecteurs = $(this).val();  
        var selectGeoVille = $('select[name="data[Search][idvillecode][]"]');
        var offredem = getValueOffredem();
        if (selectGeoVille.length > 0) {        
            selectVilleSecteurOptionValue = [];
            selectVilleSecteurOptionValue.length = 0;
            getVilleBySecteurs(selectedSecteurs,offredem).then(function(returndata){
                selectGeoVille.html(selectVilleSecteurOptionValue);
                selectGeoVille.selectpicker('refresh');
            });
        }                
    });    
}

function loadEngine(typeOffre,dep){
    if (typeOffre != "pneuf"){
        $(".containerSearch").load(getBase() + 'search/engine/' + typeOffre, function(data){
            $(".containerSearch").html(data);
            initSelectPicker();
            UpdateVille();
            advancedSearch();
            if ($('#inputSecteur, #inputDepartements').length === 2) {
              depSecteurComportement()
            }
            if ($('#inputSecteur, #inputRegions').length === 2) {
              regSecteurComportement()
            }
            startSliderPrix(typeOffre);
            startSliderSurface();
            manageForm();
        });
    }
    else{
        $(".containerSearch").load(getBase() + 'searchPneuf/engine', function(data){
            $(".containerSearch").html(data);
            initSelectPicker();
            UpdateVille();
            datePickerHc();
            autoCompleteModule();
            if ($('#inputSecteur, #inputDepartements').length > 0) {
              depSecteurComportement()
            }
            if ($('#inputSecteur, #inputRegions').length > 0) {
              regSecteurComportement()
            }
        });
    }
    if($(".moteur1").hasClass('hidden')){
        $(".moteur1").fadeToggle( "fast", "linear" );
        $(".moteur1").removeClass('hidden');
        if(isVarDefined(document.querySelector('#rev1'))){
            var rev2 = new RevealFx(document.querySelector('#rev1'), {
                revealSettings : {
                    bgcolor: $('.moteur1 h1').css('color'),
                    delay: 250,
                    onCover: function(contentEl, revealerEl) {
                        contentEl.style.opacity = 1;
                    }
                }
            });
        } else {
            var rev2 = null;
        }
        if(isVarDefined(rev2)){rev2.reveal();}
    }
}
function initSelectPicker(){
    $('.selectpicker').selectpicker({
        noneSelectedText:'',
        noneResultsText: $(this).attr('data-selectpicker-noresults'),
        selectAllText: "Tous",
        deselectAllText: "Aucun"
    });
    selectPickerForMobile();
    if ($('#AllItemlocalisation').length){
        autocompleteAllItemLocalisation();
    }
}
function advancedSearch(){
    //Animation moteur 1
    $('.moteur1 .advSearchBtn').on('click',function(){
        if(model == "dynaAgence" && $('.presentation1').length && !$('.presentation1 .mon-agence').hasClass('search-open')){
            $('.presentation1 .mon-agence').addClass('search-open');
        }else{
            $('.presentation1 .mon-agence').removeClass('search-open');
        }
        $('.moteur1 .advSearch').fadeToggle( "fast", "linear" );
        jarallax(document.querySelectorAll('.jarallax'), 'onResize');
    });

    //Animation moteur 2
    $('.moteur2 .advSearch').addClass('collapse');
    $('.moteur2 .advSearch').removeClass('hidden');
    $('.moteur2 .advSearchBtn').on('click',function(){
        if($('.moteur2 .advSearch').hasClass('show')){
            $('.moteur2 .advSearch').collapse('hide');
        }else{
            $('.moteur2 .advSearch').collapse('show');
        }
    });

    //Checkbox criteres supp
    $('.check .control_indicator').on('click', function(){
        $(this).hasClass('checked') ? $(this).removeClass('checked') : $(this).addClass('checked');
    });

    $('.control-radio .control_indicator').on('click', function(){
        var radio = $(this).parent('.control-radio').find('input');
        $('input.distanceVille').val(radio.val());
    });

}
function selectPickerForMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        $('.selectpicker').selectpicker('mobile');
    }
}

function datePickerHc(){
    if ($('.datepicker').length){
        $.when(
            $.ajax("/i/ws/getListMonth"),
            $.ajax("/i/ws/getListDays/1")
        ).done(function(a1, a2){
            var months = a1[0], days = a2[0];
            $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
            $('body').on('focus',".datepicker", function(){
                $( "#inputDate_deb" ).datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 2,
                    firstDay: 6,                
                    monthNames: months,
                    monthNamesShort: months,
                    dayNames: days,
                    dayNamesMin: days,
                    dayNamesShort: days,
                    dateFormat: "dd/mm/yy",
                    onClose: function( selectedDate ) {
                      $( "#inputDate_fin" ).datepicker( "option", "minDate", selectedDate );
                    }
                });
                $( "#inputDate_fin" ).datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 2,
                    firstDay: 6,                
                    monthNames: months,
                    monthNamesShort: months,
                    dayNames: days,
                    dayNamesMin: days,
                    dayNamesShort: days,
                    dateFormat: "dd/mm/yy",
                    onClose: function( selectedDate ) {
                      $( "#inputDate_deb" ).datepicker( "option", "maxDate", selectedDate );
                    }
                });
                $(this).datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 1,
                    firstDay: 6,                
                    monthNames: months,
                    monthNamesShort: months,
                    dayNames: days,
                    dayNamesMin: days,
                    dayNamesShort: days,
                    dateFormat: "dd/mm/yy"
                });
            });   
        });
    }
}

/*********************  Recherche Slider prix  *****************************/

function startSliderPrix(typeOffre) {
    var myStep = 10000,
        myType = typeOffre;

    if (myType == 2 || myType == 8){
        myStep = 150;
    }

    var maxPrice = getMaxPrice(myType);
    var minPosition = (getCurrentMinPrice() == 0) ? 0 : getCurrentMinPrice();
    var maxPosition = (getCurrentMaxPrice() == 0) ? maxPrice : getCurrentMaxPrice();

    $('#inputPrixMin').val(spaceSeparateNumber(minPosition));
    $('#inputPrixMax').val(spaceSeparateNumber(maxPosition));

    if ($('#slider-prix').length){
        var slider = document.getElementById('slider-prix'),
            valueMax = document.getElementById('inputPrixMax'),
            valueMin = document.getElementById('inputPrixMin');
        noUiSlider.create(slider, {
            start: [minPosition, maxPosition],
            connect: true,
            step: myStep,
            range: {
                'min': 0,
                'max': maxPrice
            }
        });

        slider.noUiSlider.on('update', function( values, handle ) {
            (handle ? valueMax : valueMin).value = spaceSeparateNumber(Math.round(values[handle]));
        });

        valueMax.addEventListener('change', function(){
            slider.noUiSlider.set([null, this.value]);
        });

        valueMax.addEventListener('change', function(){
            slider.noUiSlider.set([null, this.value]);
        });
    }

}

/*********************  Recherche Slider surface  *****************************/
function startSliderSurface() {
    var myStep = 5;

    var maxSurface = getMaxSurface();
    var minPosition = (getCurrentMinSurface() == 0) ? 0 : getCurrentMinSurface();
    var maxPosition = (getCurrentMaxSurface() == 0) ? maxSurface : getCurrentMaxSurface();

    $('#inputSurfaceMin').val(spaceSeparateNumber(minPosition));
    $('#inputSurfaceMax').val(spaceSeparateNumber(maxPosition));

    if ($('#slider-surface').length){
        var slider = document.getElementById('slider-surface'),
            valueMax = document.getElementById('inputSurfaceMax'),
            valueMin = document.getElementById('inputSurfaceMin');
        noUiSlider.create(slider, {
            start: [minPosition, maxPosition],
            connect: true,
            step: myStep,
            range: {
                'min': 0,
                'max': maxSurface
            }
        });

        slider.noUiSlider.on('update', function( values, handle ) {
            (handle ? valueMax : valueMin).value = spaceSeparateNumber(Math.round(values[handle]));
        });

        valueMax.addEventListener('change', function(){
            slider.noUiSlider.set([null, this.value]);
        });

        valueMax.addEventListener('change', function(){
            slider.noUiSlider.set([null, this.value]);
        });
    }

}

/**
 * 	Permet de recuperer le prix maximum pour un type d'offre donnÃ©
 */
function getMaxSurface(typeOffre) {
    var maxPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getMaxSurface',
        type: 'POST',
        data: { offredem: typeOffre },
        async: false,
        success: function(ret) {
            maxPrice = ret;
        }
    });
    return +maxPrice;
}

/**
 * 	Permet de recuperer le prix minimum pour un type d'offre donnÃ©
 */
function getMinSurface(typeOffre) {
    var minPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getMinSurface',
        type: 'POST',
        data: { offredem: typeOffre },
        async: false,
        success: function(ret) {
            minPrice = ret;
        }
    });
    return +minPrice;
}

/**
 * 	Permet de recuperer le prix maximum courant pour un type d'offre donnÃ©
 */
function getCurrentMaxSurface() {
    var currentMaxPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getCurrentMaxSurface',
        async: false,
        success: function(ret) {
            currentMaxPrice = ret;
        }
    });
    return +currentMaxPrice;
}

/**
 * 	Permet de recuperer le prix minimum courant pour un type d'offre donnÃ©
 */
function 	getCurrentMinSurface() {
    var currentMinPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getCurrentMinSurface',
        async: false,
        success: function(ret) {
            currentMinPrice = ret;
        }
    });
    return +currentMinPrice;
}


/*********************  Manage form submission  *****************************/
function manageForm() {
    $('form.containerSearch').on('submit', function (){
        $('.numericInput').each(function (){
            var valNumric = $(this).val().replace(/ /g,"");
            $(this).val(valNumric);
        });
    });    
}
