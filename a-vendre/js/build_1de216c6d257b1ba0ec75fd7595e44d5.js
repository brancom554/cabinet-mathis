/* *concat build_common.prd2.js* */
// Correction IE9... Pour matcheMedia

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

// Correction IE8... pour les select
Object.keys = Object.keys || function(
        o,
        k,
        r
    ) {
        r = [];
        for (k in o)
            r.hasOwnProperty.call(o, k) && r.push(k);
        return r
    };

// Correction IE8... pour gallery
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(val) {
        return $.inArray(val, this);
    };
}
function isVarDefined(myVar){    
    if (typeof myVar == "undefined" || myVar == null) {
      return false;
    } else {
      return true;
    }
}
// alertMail get geoville by dep selection
$(function (){
    
    var selectVilleOptionValue = [];
    function getVilleByDep(dep) {         
        var baseUrl = window.location.hostname;
        var jsonUrlVilleByDep = "//"+baseUrl+'/i/json/getVillesByDepForSelect?depExternalId='+dep;
        return $.getJSON(jsonUrlVilleByDep)
            .fail(function(data) { 
                if(isVarDefined(dep)) {
                    $('select[name="data[Alerte][geoville][]"]').html('');
                    $('select[name="data[Alerte][geoville][]"]').selectpicker('refresh');
                }
            })
            .success(function(data) { console.log("success jsonUrlVilleByDep  data"); })
            .then(function( data ) {
                  $.each( data, function( i, item ) {                 
                      selectVilleOptionValue.push( '<option value="'+i+'">'+item+'</option>' );
                  });
               return selectVilleOptionValue;
            });
    }
    $('select[name="data[Alerte][departement][]"]').change(function() {                
        var selectedDep = $(this).val();            
        var selectGeoVille = $('select[name="data[Alerte][geoville][]"]');
        if (selectGeoVille.length > 0) {   
            selectVilleOptionValue = [];
            selectVilleOptionValue.length = 0;
            getVilleByDep(selectedDep).then(function(returndata){
                selectGeoVille.html(selectVilleOptionValue);
                selectGeoVille.selectpicker('refresh');
            });
        }                
    });
});
// Support du placeholder
$.support.placeholder = false;
test = document.createElement("input");
if("placeholder" in test) {
    $.support.placeholder = true;
}
if (!$.support.placeholder) {
    var active = document.activeElement;
    $(":text").focus(function () {
        if ($(this).attr("placeholder") != "" && $(this).val() == $(this).attr("placeholder")) {
            $(this).val("");
        }
        $(this).removeClass("hasPlaceholder");
    }).blur(function () {
        if ($(this).attr("placeholder") != "" && ($(this).val() == "" || $(this).val() == $(this).attr("placeholder"))) {
            $(this).val($(this).attr("placeholder")).addClass("hasPlaceholder");
        }
    });

    $("textarea").focus(function () {
        if ($(this).attr("placeholder") != "" && $(this).val() == $(this).attr("placeholder")) {
            $(this).val("");
        }
        $(this).removeClass("hasPlaceholder");
    }).blur(function () {
        if ($(this).attr("placeholder") != "" && ($(this).val() == "" || $(this).val() == $(this).attr("placeholder"))) {
            $(this).val($(this).attr("placeholder")).addClass("hasPlaceholder");
        }
    });

    $(":text").blur();
    $("textarea").blur();
    $(active).focus();
    $("form").submit(function () {
        $(this).find(".hasPlaceholder").each(function() {
            $(this).val("");
        });
    });
}


$('.selectpicker').selectpicker({
    noneSelectedText:'',
    noneResultsText: 'Aucun résultat',
    selectAllText: "Tous",
    deselectAllText: "Aucun"
});

function getBase() {
    return $('base').attr('href');
}

/**
 * 	Permet de recupÃ©rer le type d'offre actuel
 */
function getTypeoffre() {
    var msg = null;
    $.ajax({
        url: getBase() + 'javascript/getTypeoffre',
        async: false,
        success: function(ret) {
            msg = ret;
        }
    });
    return msg;
}

/**
 * 	Permet de recuperer le prix maximum pour un type d'offre donnÃ©
 */
function getMaxPrice(typeOffre) {
    var maxPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getMaxPrice',
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
function getMinPrice(typeOffre) {
    var minPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getMinPrice',
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
function getCurrentMaxPrice() {
    var currentMaxPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getCurrentMaxPrice',
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
function 	getCurrentMinPrice() {
    var currentMinPrice = null;
    $.ajax({
        url: getBase() + 'javascript/getCurrentMinPrice',
        async: false,
        success: function(ret) {
            currentMinPrice = ret;
        }
    });
    return +currentMinPrice;
}

/********************  Selection Biens ******************************************/

/**
 * 	Appel AJAX permettant d'ajouter/retirer un bien à la selection
 */
function setSelection(id) {
    $.ajax({
        url: getBase() + 'selection/addbien/' + id
    }).done(function(msg) {
        $('.nbSelection').html(msg);
    });
}


function setSelectiondelete(id) {
    $.ajax({
        url: getBase() + 'selection/deletebien/' + id
    }).done(function(msg) {
        $('.nbSelection').html(msg);
    });
}



/**
 * 	Permet de Séparer les milles et les cents
 */
function spaceSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+' '+'$2');
    }
    return val;
}

function format(comma, period) {
    comma = comma || ',';
    period = period || '.';
    var split = this.toString().split('.');
    var numeric = split[0];
    var decimal = split.length > 1 ? period + split[1] : '';
    var reg = /(\d+)(\d{3})/;
    while (reg.test(numeric)) {
        numeric = numeric.replace(reg, '$1' + comma + '$2');
    }
    return numeric + decimal;
}



/********************  Public file downloader ******************************************/
$('.form-download select').change(function (){
    if ($(this).val()){
        $('.form-download .btn-download').removeAttr('disabled');
    }
    else{
        $('.form-download .btn-download').attr('disabled','disabled');
    }
});


/********************  Lightslider page detail ******************************************/

function lightSliderManager(thumbItem, thumbMargin, nextIcon, prevIcon, galleryMargin, more){
    var urls = [];

    var options = {
        gallery:true,
        item:1,
        loop:false,
        thumbItem:thumbItem,
        slideMargin:0,
        enableDrag: false,
        currentPagerPosition:'left',
        thumbMargin: thumbMargin,
        nextHtml: "<span class='icon "+nextIcon+"'></span>",
        prevHtml: "<span class='icon "+prevIcon+"'></span>",
        galleryMargin: galleryMargin,
        lang: {
            allPhotos: ''
        },
        onSliderLoad: function(el) {
            el.lightGallery({
                selector: '.gallery .lslide',
                lang: {
                    allPhotos: ''
                },
                videoMaxWidth: '80%',
                exThumbImage: 'data-src-forthumb'
            });
            el.removeClass('loading');
            el.closest('.lSSlideOuter').prev().addClass('hide');

            el.find('.video-container').each(function (index){
                urls[$(this).attr('data-iterator')] = $(this).find('iframe').attr('src');
                if (index > 0){
                    $(this).find('iframe').attr('src', '');
                }

            });
        },
        onAfterSlide: function (el, current) {
            var $this = el.children().eq(current),
                $iterator = parseInt($this.attr('data-iterator'));
            el.find('.video-container').each(function (){
                $(this).find('iframe').attr('src', '');
            });
            if ($this.hasClass('video-container')){
                var iframe = $this.find('iframe');
                el.closest('.lSSlideOuter').prev().removeClass('hide');
                iframe.attr('src', urls[$iterator]);
                iframe.on('load', function (){
                    el.closest('.lSSlideOuter').prev().addClass('hide');
                });
            }
        }
    };
    if (!$.isEmptyObject(more)){
        $.each(more, function (i, v){
            options[i] = v;
        });
    }
    $('.imageGallery').lightSlider(options);
}


if ($('#inputTypeBien_transac').length && $('#inputSurfMin').length && $('#inputSurfMax').length){
    if ($('#inputTypeBien_transac').val() == 5){
        $('#inputSurfMin').attr('placeholder', $('#inputSurfMin').attr('data-terrain'));
        $('#inputSurfMax').attr('placeholder', $('#inputSurfMax').attr('data-terrain'));
    }
    $('#inputTypeBien_transac').change(function (){
        if ($(this).val() == 5){
            $('#inputSurfMin').attr('placeholder', $('#inputSurfMin').attr('data-terrain'));
            $('#inputSurfMax').attr('placeholder', $('#inputSurfMax').attr('data-terrain'));
        }
    });
}

/********************  Ville autocomplete alerte mail ******************************************/

var villes = [];

function autocompleteVilleAlerteMail(){
    $('#villesautocomplete').autocomplete({
        minLength: 0,
        source: function( request, response ) {
            $.getJSON(getBase() + 'i/javascript/listVilles?s=' + request.term, function (elements){
                response($.map(elements.list, function (data){
                    return {
                        value: data.id,
                        label: data.nom
                    }
                }));
            });
        },

        select: function( event, ui ) {
            var ville = ui.item.label,
                id = ui.item.value,
                idmulti = false;
            if (id.indexOf(',') !== -1){
                idmulti = true;
                var ids = id.split(',');
            }
            if (villes.indexOf(id) === -1){
                $(this).before('<span class="currentVille" data-idville="'+id+'" onclick="deleteVille(this)">'+ville+' <span class="delVille">&times;</span></span>');
                if (idmulti){
                    for (var i in ids) {
                        if (villes.indexOf(ids[i]) === -1 ){
                            villes.push(ids[i]);
                            $('#clone').clone().attr('id', 'clone'+ids[i]).val(ids[i]).removeAttr('disabled').appendTo('.autocomplete');
                        }
                        else{
                            $('span[data-idville="'+ids[i]+'"]').remove();
                        }
                    }
                }
                else{
                    villes.push(id);
                    $('#clone').clone().attr('id', 'clone'+id).val(id).removeAttr('disabled').appendTo('.autocomplete');
                }
            }

            $(this).val('');

            return false;
        }
    });

}

function deleteVille(element){
    var current = $(element).attr('data-idville');
    if (current.indexOf(',') !== -1){
        var currentids = current.split(',');
        for (var j in currentids){
            villes = $.grep(villes, function (val){
                $(element).remove();
                $('#clone'+currentids[j]).remove();
                return  val !== currentids[j];
            });
        }
    }
    else{

        villes = $.grep(villes, function (val){
            $(element).remove();
            $('#clone'+current).remove();
            return  val !== current;
        });

    }
}

$(function (){
    $('[data-toggle="tooltip"]').tooltip();
    if ($('#villesautocomplete').length){
        autocompleteVilleAlerteMail();
    }
});



/******************** All item localisation autocomplete for search engine  ******************************************/

function dump(v, s) {
    s = s || 1;
    var t = '';
    switch (typeof v) {
        case "object":
            t += "\n";
            for (var i in v) {
                t += Array(s).join(" ")+i+": ";
                t += dump(v[i], s+3);
            }
            break;
        default: //number, string, boolean, null, undefined
            t += v+" ("+typeof v+")\n";
            break;
    }
    return t;
}
var selectedGloballocalisation = [] ;
function addafficheGloballocalisationselected(element){
    $('.listVilleSelected').append('<li class="'+element.value+'"><span class="text" data-elementValue="'+element.value+'">'+element.label+'</span><span class="remove">x</span></li>')
}
function updateLabelTextResultLocalisation(){
    var selectedlabel = '';
    $.each(selectedGloballocalisation, function (i ,v){
        if (typeof selectedGloballocalisation[i].label != 'undefined'  &&  selectedGloballocalisation[i].label && selectedGloballocalisation[i].label != 'undefined') {
            selectedlabel = selectedlabel+' - '+selectedGloballocalisation[i].label;
        }
    });
    $("#textResultLocalisation").val(selectedlabel);
}
function addGloballocalisation(element){
    selectedGloballocalisation.push({
        label: element.label,
        value: element.value
    });
    updateSelectedGloballocalisationSession ();
    addafficheGloballocalisationselected(element);
    updateLabelTextResultLocalisation();
}
function getIdsGloballocalisation(){
    var ids = [];
    $.each(selectedGloballocalisation, function (i ,v){
        ids.push(selectedGloballocalisation[i].value) ;
    });
    return ids;
}
function initSelectedGloballocalisationSession (){
    if(typeof sessionStorage != "undefined") {
        if ( sessionStorage.getItem("selectedGloballocalisation") ) {
            selectedGloballocalisation = JSON.parse(sessionStorage.getItem("selectedGloballocalisation"));
            var selectedlabel = '' ;
            $.each(selectedGloballocalisation, function (i ,v){
                addafficheGloballocalisationselected(selectedGloballocalisation[i]);
                $('#hidden').val(selectedGloballocalisation[i].value);
                if (typeof selectedGloballocalisation[i].label != 'undefined'  && selectedGloballocalisation[i].label &&  selectedGloballocalisation[i].label != 'undefined') {
                    selectedlabel = selectedlabel+' - '+selectedGloballocalisation[i].label;
                }
                var ids = getIdsGloballocalisation();
                $('#AllItemlocalisation').append('<input id="globallocalisation" class="id-'+selectedGloballocalisation[i].value+'" name="data[Search][global-localisation][]" type="hidden" value="'+selectedGloballocalisation[i].value+'">');
                $('.id-').remove();
                if ( ids && $(".selectedlist.hidden").length ) {
                    $('.selectedlist').removeClass('hidden');
                }
            });
            $("#textResultLocalisation").val(selectedlabel);
        }
    }

}
function updateSelectedGloballocalisationSession (){
    if ( selectedGloballocalisation.length >= 0 ) {
        sessionStorage.setItem("selectedGloballocalisation", JSON.stringify(selectedGloballocalisation));
    }
}
function autocompleteAllItemLocalisation(){
    initSelectedGloballocalisationSession();
    $("#AllItemlocalisationAutocomplete").autocomplete({
        source: function(req, add){
            //pass request to server
            $.getJSON("localisationAllItems.js?term="+req['term'], req, function(data) {
                var suggestions = [];
                $.each(data, function(index , data ){
                    suggestions.push({
                        label: data,
                        value: index
                    });
                });
                add(suggestions);
            });
        },
        select: function(e, ui) {
            e.preventDefault();
            $(this).val(ui.item.label);
            addGloballocalisation(ui.item);
            $('#hidden').val(ui.item.value);
            $("#AllItemlocalisationAutocomplete").val(ui.item.label);
            var ids = getIdsGloballocalisation();
            $('#AllItemlocalisation').append('<input id="globallocalisation" class="id-'+ui.item.value+'" name="data[Search][global-localisation][]" type="hidden" value="'+ui.item.value+'">');
            $('.id-').remove();
            $(this).val('');
        },
        change: function() {
            $("#AllItemlocalisationAutocomplete").val("").css("top", 2);
        },
        focus: function (event, ui) {
            this.value = ui.item.label;
            // or $('#autocomplete-input').val(ui.item.label);

            // Prevent the default focus behavior.
            event.preventDefault();
            // or return false;
        }
    });
    $("#AllItemlocalisation").click(function(){
        $("#AllItemlocalisationAutocomplete").focus();
    });

    $("#AllItemlocalisation").on("click","#AllItemlocalisationAutocomplete", function(){
        $(this).val('');
    });
    $("#AllItemlocalisation").on("click",".remove", function(){
        if($("#AllItemlocalisation span").length === 0) {
            $("#AllItemlocalisationAutocomplete").css("top", 0);
        }
    });
    $(".selectedVilleSearch").on("click",".remove", function(){
        var elementRemove = $(this).parent().find(".text").data("elementvalue");
        $('.'+elementRemove).remove();
        $('.id-'+elementRemove).remove();
        indextoremove = getIdsGloballocalisation().indexOf(elementRemove);
        if (indextoremove > -1) {
            selectedGloballocalisation.splice(indextoremove, 1);
        }
        updateSelectedGloballocalisationSession ();
        updateLabelTextResultLocalisation();
    });
    $(function(){
        var $win = $(window);
        var $box = $(".fieldsVilleSearch");
        $win.on("click",function(event) {
            eClass = $(event.target).attr('class');
            if ( $("." + eClass).parents("body").length == 1 && !$("." + eClass).is(".menulocalistion") && !$("." + eClass).is(".btnmenulocalistion")) {
                if($('.menulocalistion.hidden').length == 0 ){
                    $('.menulocalistion').addClass('hidden');
                }
            }
        });
        $box.on("click",".btnmenulocalistion", function(){
            if($('.menulocalistion.hidden').length == 0 ){
                $('.menulocalistion').addClass('hidden');
            }
            else {
                if($('.menulocalistion.hidden').length){
                    $('.menulocalistion').removeClass('hidden');
                    $('#AllItemlocalisationAutocomplete').focus();
                }
            }
        });
    });
}
/********************  Ville and dep autocomplete for search engine  ******************************************/
var localisation = [];
function autocompleteDepVilles(){
    $.getJSON(getBase() + 'i/javascript/localisationDepVillesPneuf', function (elements){

        $.widget( "custom.catcomplete", $.ui.autocomplete, {
            _create: function() {
                this._super();
                this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
            },
            _renderMenu: function( ul, items ) {
                var that = this,
                    currentCategory = "";
                $.each( items, function( index, item ) {
                    var li;
                    if ( item.category != currentCategory ) {
                        ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
                        currentCategory = item.category;
                    }
                    li = that._renderItemData( ul, item );
                    if ( item.category ) {
                        li.attr( "aria-label", item.category + " : " + item.label );
                    }
                    if (localisation.indexOf(item.value) !== -1){
                        li.addClass('active');
                    }
                });
            }
        });
        var availableLocalisation = [];
        $.each(elements.list, function (key, val){
            $.map(val, function (data, index){
                availableLocalisation.push({
                    value: index,
                    label: data,
                    category: key
                });
            });
        });

        var selected = elements.selected;
        for (var select in selected){
            for (var sv in selected[select]){
                var idSelected = selected[select][sv],
                    current = availableLocalisation.filter(function (val){
                        return (val.value === idSelected)
                    });

                addToSelectedList(idSelected, current[0].label);

                var currentid = transformToArray(idSelected);
                for (var ids in currentid){
                    cloneInput(currentid[ids]);
                    localisation.push(currentid[ids]);
                }
            }
        }

        isVillesSelected();

        $('#localisationAutocomplete').catcomplete({
            minLength: 0,
            source: availableLocalisation,

            select: function( event, ui ) {
                var label = ui.item.label,
                    id = ui.item.value;

                var listids = transformToArray(id);

                if (localisation.indexOf(id) === -1){

                    addToSelectedList(id, label);

                    for (var i in listids) {
                        cloneInput(listids[i]);
                        localisation.push(listids[i]);
                    }
                }
                $(this).val('');
                isVillesSelected();
                return false;
            }
        }).focus(function () {
            $(this).catcomplete("search");
        });;
    });
}

allvilles = [];
function allVilleAutocomplete(){
    $('#allVillesAutocomplete').autocomplete({
        minLength: 3,
        source: function( request, response ) {
            $.getJSON(getBase() + 'i/javascript/localisationAllVilles?term=' + request.term, function (elements){
                response($.map(elements.list.ville, function (data, index){
                    return {
                        value: index,
                        label: data
                    }
                }));
            });
        },

        select: function( event, ui ) {
            var label = ui.item.label,
                id = ui.item.value;

            var listids = transformToArray(id);

            if (allvilles.indexOf(id) === -1){

                addToSelectedList(id, label);

                for (var i in listids) {
                    cloneInput(listids[i]);
                    allvilles.push(listids[i]);
                }
            }
            $(this).val('');
            isVillesSelected();
            return false;
        }
    });
}

function addToSelectedList(id, label){
    $('.listVilleSelected').append('<li data-id="'+id+'" onclick="deleteVilleSearch(this)">'+
        '<span class="currentVilleSearch">' + label + ' <span class="delVille">&times;</span></span>'+
        '</li>');
}

function transformToArray(string){
    if (string.indexOf(',') !== -1){
        return string.split(',');
    }
    return [string];
}

function cloneInput(idSearch){
    var element = (idSearch.length > 2) ? "ville" : "dep";
    $('#clone'+element+'ForSearch').clone().attr('id', 'clone'+element+'ForSearch'+idSearch).val(idSearch).removeAttr('disabled').appendTo('.fieldsVilleSearch');
}

function deleteVilleSearch(element){
    var currentids = transformToArray($(element).attr('data-id'));
    for (var j in currentids){
        var searchfor = (currentids[j].length > 2) ? "ville" : "dep";
        localisation = $.grep(localisation, function (val){
            $(element).remove();
            $('#clone'+searchfor+'ForSearch'+currentids[j]).remove();
            return  val !== currentids[j];
        });
    }
    isVillesSelected();
}

function isVillesSelected(){
    if ($('.listVilleSelected li').length){
        $('.showVilleSelected').show();
    }
    else{
        $('.showVilleSelected').hide();
    }
}
function autoCompleteModule(){
    if ($('#localisationAutocomplete').length){
        autocompleteDepVilles();
        $('.showVilleSelected').click(function (){
            $('.listVilleSelected').slideToggle('5000','easeOutBack', function (){});
        });
    }

    if ($('#allVillesAutocomplete').length){
        allVilleAutocomplete();
        $('.showVilleSelected').click(function (){
            $('.listVilleSelected').slideToggle('5000','easeOutBack', function (){});
        });
    }
}

function formatDateForRequest (d) {
    var month = String(d.getMonth() + 1),
        day = String(d.getDate()),
        year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return String(year+'-'+month+'-'+day);
}




function DateReserver(startDate, endDate) {
    var idAnn= $('.idBien').val();
    $.ajax({
        url: getBase() + 'i/ws/locsais_getfreedays/'+ idAnn +'/'+startDate+'/'+endDate+'/',
        async: false,
        success: function(ret) {
            msg = ret;
        },
        error: function (err){
            msg = err;
        }
    });
    return msg;
}

function disponibilite(startDate, endDate){

    var statutDate = -1,
        free = -1,
        isinperiode = -1,
        statut = null,
        pastStatut = null;

    $.each(DateReserver(startDate, endDate), function( index, value ) {
        free=value.free;
        isinperiode = value.isinperiode;
        statutDate=value.date;
        var date = new Date(statutDate);
        statut = free;

        if(statut !== pastStatut && pastStatut !== null && date.getDay() === 6 && isinperiode){
            $('.fc-day-'+statutDate).addClass("first-section");
        }

        if (free && isinperiode){
            $('.fc-day').attr('data-date',function (i, val){
                if (val === statutDate){
                    $(this).addClass("dispo");
                }
            });
            $('.fc-day-'+statutDate).addClass("dispo");
        } else if (!free) {
            $('.fc-day').attr('data-date',function (i, val){
                if (val === statutDate){
                    $(this).addClass("reserver");
                }
            });
            $('.fc-day-' + statutDate).addClass('reserver');
        }

        if(pastStatut !== statut  && date.getDay() === 0){
            var yesterdayTime = date.setDate(date.getDate()-1);
            var yesterday = new Date(yesterdayTime);
            var dayId = '.fc-day-' + yesterday.getFullYear() + '-' + ('0' + (yesterday.getMonth()+1)).slice(-2) + '-' + ('0' + yesterday.getDate()).slice(-2) ;

            $(dayId).addClass('last-section');
        }
        pastStatut = statut;
    });

    $(".first-section").append('<div class="triangle-first"></div>');
    $(".last-section").append('<div class="triangle-last"></div>');
}

function goToMonth(month) {
    var date = new Date();
    var d = date.getDate();
    var m = month !== undefined ? parseInt(month, 0) : date.getMonth();
    var y = date.getFullYear();
    return new Date(y, m, d);
}

function monthsList(element) {
    $.when(
        $.ajax("/i/ws/getListMonth")
    ).done(function (tab){
        for (var m = 0; m < tab.length; m++) {
            $(element).append('<option value="' + m + '">' + tab[m] + '</option>');
        }
    });
}

var Animate = {
    initialize: function (element, animtype){
        this.element = element;
        this.animtype = animtype;
        $(this.element).addClass(this.animtype);
    },
    docViewTop : function (){
        return $(window).scrollTop();
    },
    docViewBottom : function (){
        return this.docViewTop() + $(window).height();
    },
    elemTop : function (){
        if ($(this.element).length){
            return $(this.element).offset().top + 100;
        }
        return 0;
    },
    elemBottom : function (){
        if ($(this.element).length){
            return this.elemTop() + $(this.element).height();
        }
        return 0;
    },
    isInView: function (){
        return ((this.elemBottom() <= this.docViewBottom()) && (this.elemTop() >= this.docViewTop()));
    },
    go: function (){
        if (this.isInView()) {
            $(this.element).addClass(this.animtype + '-anim');
        } else {
            $(this.element).removeClass(this.animtype + '-anim');
        }
    }
};

var ForbiddenClassException = { /* excludes class exception */ };

/**
 * Le comportement est que si on voit des balises dans notre texte on ne fait rien
 * @param toIterate
 * @param classNameToAdd
 * @param excludes
 */
function updateTitles(toIterate, classNameToAdd, excludes) {
    $(toIterate).each(function(){
        try {
            var parent = $(this).parent().parent();
            var parentClasses = parent[0].classList;
            if (Array.isArray(excludes)) {
                excludes.forEach(function (i) {
                    if (parentClasses.contains(i)) {
                        throw ForbiddenClassException;
                    }
                });
            }
            var text = $(this).text().trim();
            var tabText = text.split(' ');

            var itemsToUpdate;
            if (tabText.length > 2) {
                itemsToUpdate = tabText.slice(2);
            } else if (tabText.length > 1) {
                itemsToUpdate = tabText.slice(-1);
            } else {
                return true;
            }
            var html = $(this).html();
            var subText = itemsToUpdate.join(' ');
            var indexOfSubText = html.indexOf(subText);
            if (indexOfSubText < 0) {
                return true;
            }
            var snippet = html.substr(indexOfSubText, subText.length);
            if (snippet !== subText) {
                return true;
            }
            var spanned = '<span class="'+classNameToAdd+'">'+subText+'</span>';
            var newhtml = html.replace(snippet, spanned);
            $(this).html(newhtml);
        } catch (e) {
            if (e !== ForbiddenClassException) {
                throw e;
            }
        }
    });
}


// Gestion de l'expand de contenu
$(function (){
    $('.expand-btn').each(function(index) {
        $($(this).data('expand-content')).css({
            height: 'auto'
        })
        $($(this).data('expand-content')).slideUp(0);

    });
    $(document).on('click', '.expand-btn', function(e) {
        e.preventDefault();
        
        var text = $(this).text();
        $(this).html($(this).data('alt-text'));
        $(this).data('alt-text', text);
        
        $($(this).data('expand-content')).slideToggle();
        
    });
});

function load_iframes() {
    var vidDefer = document.getElementsByTagName('iframe');
    for (var i=0; i<vidDefer.length; i++) {
        if(vidDefer[i].getAttribute('data-src')) {
            vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
        }
    }
}
document.addEventListener("DOMContentLoaded", function(event) {
    load_iframes();
});
/* *concat build_prd2.theme.js* */
$(window).on('beforeunload', function(){
    $(window).scrollTop(0);
});


$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 1) {
        $('.navbar').addClass('fixed-top');
    } else {
        $('.navbar').removeClass('fixed-top');
    }
});



function getBase() {
    return $('base').attr('href');
}

$('.selection').on('click', '.selection-bien', function () {
    var idBien = $(this).data("id");
    addSelection(idBien);
    if ($(this).hasClass('btn')) {
        $(this).removeClass('selection-bien');
        $(this).addClass('selected-bien');
    } else {
        $(".selected-bien[data-id='" + idBien + "']").fadeToggle("fast", "linear");
    }
});

$('.selection').on('click', '.selected-bien', function () {
    var idBien = $(this).data("id");
    removeSelection(idBien);
    if ($(this).hasClass('btn')) {
        $(this).removeClass('selected-bien');
        $(this).addClass('selection-bien');
    } else {
        $(".selected-bien[data-id='" + idBien + "']").fadeToggle("fast", "linear");
    }
});

$('.icon-scroll').on('click', function () {
    $("html, body").animate({ scrollTop: $('.section-bienvenue').offset().top - 400 }, "slow");
    return false;
});
/**
 * Hack dropdown link
 */
$('.nav-link.dropdown-toggle').on('click', function(){
    // On verifie qu'on est pas sur mobile
    if($(this).attr('href') === "/#" && !$('.navbar-collapse').hasClass("show")){
        setTimeout(function(){
            $('.dropdown-menu').removeClass('show');
        },100);
    }
    //On check si le sous menu est déjà ouvert dans ce cas on fait fonctionner l'url
    if($(this).attr('aria-expanded') === "true" && $(this).attr('href') !== "/#"){
        window.location.href = $(this).attr('href');
    }
});
$('.nav-link.dropdown-toggle').hover(
    function(){
        var self = this;
        setTimeout(function(){
            $(self).attr('aria-expanded', "true");
        },100);
    },
    function(){
        $(this).attr('aria-expanded', "false");
    }
)
/** */


function disappearScrollIcon() {
    $('.icon-scroll').removeClass('bounce');
    $('.icon-scroll').addClass('fadeOutDown');

    $('.icon-scroll').removeClass('animated');
    $('.icon-scroll').addClass('animated-once');

    $('.icon-scroll').addClass('opacity-none')
}
function appearScrollIcon() {
    $('.icon-scroll').removeClass('opacity-none');
    $('.icon-scroll').removeClass('fadeOutDown');
    $('.icon-scroll').addClass('bounce');

    $('.icon-scroll').removeClass('animated-once');
    $('.icon-scroll').addClass('animated');
}

function addSelection(id) {
    $.ajax({
        url: getBase() + 'selection/addbien/' + id
    }).done(function (nb) {
        $('.nbSelection').html(nb);
    });
}

function removeSelection(id) {
    $.ajax({
        url: getBase() + 'selection/deletebien/' + id
    }).done(function (nb) {
        $('.nbSelection').html(nb);
    });
}

$(document).ready(function () {
    $('#inputOffredem').trigger("change");

    if ($('.gmap').length > 0) {
        $.ajaxSetup({ cache: true });
        $.getScript(getBase() + 'javascript/gmap');
    }
    if ($('.gmap-neuf').length > 0) {
        $.ajaxSetup({ cache: true });
        $.getScript(getBase() + 'javascript/gmapNeuf');
    }
    if ($('.gmap-bien').length > 0) {
        var offredem = $(".gmap-bien").attr('data-offredem');
        $.ajaxSetup({ cache: true });
        $.getScript(getBase() + 'javascript/gmapAnnonces?offredem=' + offredem);
    }

    if ($('.datepicker').length){
        $.when(
            $.ajax("/i/ws/getListMonth"),
            $.ajax("/i/ws/getListDays/1")
        ).done(function(a1, a2){
            var months = a1[0], days = a2[0];
            $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
            $('body').on('focus',".datepicker", function(){
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

    $('[data-animation-hidden]').each(function() {
        var element = $(this);
        //element.css("visibility","hidden");
    });

    $(".module").on('classadded', function(ev, newClasses){
        /** On enleve enleve / active les animations off */
        $('.module:not(.animateModule) *[data-animated]').each(function() {
            var element = $(this);
            var animation = $(this).data("animationOn");
            var animationOff = $(this).data("animationOff");
            element.removeClass("animated-once  " + animation);
            element.addClass("animated-once  " + animationOff)
                .on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(e) {
                    $(this).removeAttr('data-animated');
                    $(this).css('visibility','hidden');
                    $(this).removeClass("animated-once  " + animationOff);
                });
        })
        /** On active les animations sur le parent */
        if($(this).attr('data-animation-on') !== ""){
            var animation = $(this).data("animationOn");
            
            $(this).addClass("animated-once  " + animation)
            .on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(e) {
                $(this).attr('data-animated',true);
                $(this).css('visibility','');
                
            });
        }        
        /***
         * On active les animations sur les childs
         */
        var elements = $(this).find('[data-animation-on]');
        elements.each(function() {
            
            var element = $(this);
            var animation = $(this).data("animationOn");
            $(this).css('visibility','');
            
            element.addClass("animated-once  " + animation)
                .on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(e) {
                    $(this).attr('data-animated',true);
                    
                });       
        });
    });

    $('.deleteSelection').click(function(){
        var delet = $(this).closest('article'),
            id = (null != $(this).find("input").val()) ? $(this).find("input").val() : $(this).attr('data-todelete');
        setSelectiondelete(id);
        delet.fadeOut();
    });

    function setSelectiondelete(id) {
        $.ajax({
            url: getBase() + 'selection/deletebien/' + id
        }).done(function(msg) {
            $('.nbSelection').html(msg);
        });
    }
 /************* partage Rsv des pages details actu ***************************/
 
    $('#twitter').sharrre({
        share: {
          twitter: true
        },
        enableHover: false,
        enableTracking: true,
        click: function(api, options){
          api.simulateClick();
          api.openPopup('twitter');
        }
      });
      $('#facebook').sharrre({
        share: {
          facebook: true
        },
        enableCounter:false,
        template:"",
        enableHover: false,
        enableTracking: true,
        click: function(api, options){
          api.simulateClick();
          api.openPopup('facebook');
        }
      });
      $('#gplus').sharrre({
        share: {
          googleplus: true
        },
        enableHover: false,
        enableTracking: true,
        click: function(api, options){
          api.simulateClick();
          api.openPopup('googlePlus');
        }
      });
});
/* *concat build_animation.prd2.js* */
$(document).ready(function() {
    $('.scroller').each(function (i, element) {
		var modules = $('.module', element);
		var container = scrollMonitor.createContainer(element);
		modules.each(function (i, moduleEl) {
			var watcher = container.create(moduleEl,{top: 50, bottom: 50});
			watcher.stateChange(listener);
			listener(null, watcher);
			if ($(this).find('.jarallax').length === 0 && !$(this).hasClass('jarallax'))
			{
				$(this).addClass('module-not-visible');
			}


		});
	});


    function listener(event, watcher) {
		if (!watcher.isInViewport) {
			return;
			//watcher.watchItem.addClass('animated-once').removeClass('animated-once');
		} else if (watcher.isFullyInViewport) {
			//watcher.watchItem.style.backgroundColor = '#fcc';
		} else if (watcher.isAboveViewport) {
			//watcher.watchItem.addClass('animated-once').removeClass('animated-once')
		} else if (watcher.isBelowViewport) {
			watcher.watchItem.classList.add('animate');
		}
	}
});


(function(window) {
	
		'use strict';
	
		// Helper vars and functions.
		function extend(a, b) {
			for(var key in b) { 
				if( b.hasOwnProperty( key ) ) {
					a[key] = b[key];
				}
			}
			return a;
		}
	
		function createDOMEl(type, className, content) {
			var el = document.createElement(type);
			el.className = className || '';
			el.innerHTML = content || '';
			return el;
		}
	
		/**
		 * RevealFx obj.
		 */
		function RevealFx(el, options) {
			this.el = el;
			this.options = extend({}, this.options);
			extend(this.options, options);
			this._init();
		}
	
		/**
		 * RevealFx options.
		 */
		RevealFx.prototype.options = {
			// If true, then the content will be hidden until it´s "revealed".
			isContentHidden: true,
			// The animation/reveal settings. This can be set initially or passed when calling the reveal method.
			revealSettings: {
				// Animation direction: left right (lr) || right left (rl) || top bottom (tb) || bottom top (bt).
				direction: 'lr',
				// Revealer´s background color.
				bgcolor: '#f0f0f0',
				// Animation speed. This is the speed to "cover" and also "uncover" the element (seperately, not the total time).
				duration: 500,
				// Animation easing. This is the easing to "cover" and also "uncover" the element.
				easing: 'easeInOutQuint',
				// percentage-based value representing how much of the area should be left covered.
				coverArea: 0,
				// Callback for when the revealer is covering the element (halfway through of the whole animation).
				onCover: function(contentEl, revealerEl) { return false; },
				// Callback for when the animation starts (animation start).
				onStart: function(contentEl, revealerEl) { return false; },
				// Callback for when the revealer has completed uncovering (animation end).
				onComplete: function(contentEl, revealerEl) { return false; }
			}
		};
	
		/**
		 * Init.
		 */
		RevealFx.prototype._init = function() {
			this._layout();
		};
	
		/**
		 * Build the necessary structure.
		 */
		RevealFx.prototype._layout = function() {
			var position = getComputedStyle(this.el).position;
			if( position !== 'fixed' && position !== 'absolute' && position !== 'relative' ) {
				this.el.style.position = 'relative';
			}
			// Content element.
			this.content = createDOMEl('div', 'block-revealer__content', this.el.innerHTML);
			if( this.options.isContentHidden) {
				this.content.style.opacity = 0;
			}
			// Revealer element (the one that animates)
			this.revealer = createDOMEl('div', 'block-revealer__element');
			this.el.classList.add('block-revealer');
			this.el.innerHTML = '';
			this.el.appendChild(this.content);
			this.el.appendChild(this.revealer);
		};
	
		/**
		 * Gets the revealer element´s transform and transform origin.
		 */
		RevealFx.prototype._getTransformSettings = function(direction) {
			var val, origin, origin_2;
	
			switch (direction) {
				case 'lr' : 
					val = 'scale3d(0,1,1)';
					origin = '0 50%';
					origin_2 = '100% 50%';
					break;
				case 'rl' : 
					val = 'scale3d(0,1,1)';
					origin = '100% 50%';
					origin_2 = '0 50%';
					break;
				case 'tb' : 
					val = 'scale3d(1,0,1)';
					origin = '50% 0';
					origin_2 = '50% 100%';
					break;
				case 'bt' : 
					val = 'scale3d(1,0,1)';
					origin = '50% 100%';
					origin_2 = '50% 0';
					break;
				default : 
					val = 'scale3d(0,1,1)';
					origin = '0 50%';
					origin_2 = '100% 50%';
					break;
			};
	
			return {
				// transform value.
				val: val,
				// initial and halfway/final transform origin.
				origin: {initial: origin, halfway: origin_2},
			};
		};
	
		/**
		 * Reveal animation. If revealSettings is passed, then it will overwrite the options.revealSettings.
		 */
		RevealFx.prototype.reveal = function(revealSettings) {
			// Do nothing if currently animating.
			if( this.isAnimating ) {
				return false;
			}
			this.isAnimating = true;
			
			// Set the revealer element´s transform and transform origin.
			var defaults = { // In case revealSettings is incomplete, its properties deafault to:
					duration: 500,
					easing: 'easeInOutQuint',
					delay: 0,
					bgcolor: '#f0f0f0',
					direction: 'lr',
					coverArea: 0
				},
				revealSettings = revealSettings || this.options.revealSettings,
				direction = revealSettings.direction || defaults.direction,
				transformSettings = this._getTransformSettings(direction);
	
			this.revealer.style.WebkitTransform = this.revealer.style.transform =  transformSettings.val;
			this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin =  transformSettings.origin.initial;
			
			// Set the Revealer´s background color.
			this.revealer.style.backgroundColor = revealSettings.bgcolor || defaults.bgcolor;
			
			// Show it. By default the revealer element has opacity = 0 (CSS).
			this.revealer.style.opacity = 1;
	
			// Animate it.
			var self = this,
				// Second animation step.
				animationSettings_2 = {
					complete: function() {
						self.isAnimating = false;
						if( typeof revealSettings.onComplete === 'function' ) {
							revealSettings.onComplete(self.content, self.revealer);
						}
					}
				},
				// First animation step.
				animationSettings = {
					delay: revealSettings.delay || defaults.delay,
					complete: function() {
						self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;		
						if( typeof revealSettings.onCover === 'function' ) {
							revealSettings.onCover(self.content, self.revealer);
						}
						anime(animationSettings_2);		
					}
				};
	
			animationSettings.targets = animationSettings_2.targets = this.revealer;
			animationSettings.duration = animationSettings_2.duration = revealSettings.duration || defaults.duration;
			animationSettings.easing = animationSettings_2.easing = revealSettings.easing || defaults.easing;
	
			var coverArea = revealSettings.coverArea || defaults.coverArea;
			if( direction === 'lr' || direction === 'rl' ) {
				animationSettings.scaleX = [0,1];
				animationSettings_2.scaleX = [1,coverArea/100];
			}
			else {
				animationSettings.scaleY = [0,1];
				animationSettings_2.scaleY = [1,coverArea/100];
			}
	
			if( typeof revealSettings.onStart === 'function' ) {
				revealSettings.onStart(self.content, self.revealer);
			}
			anime(animationSettings);
		};
		
		window.RevealFx = RevealFx;
	
	})(window);
/* *concat build_nouislider.js* */
/*! nouislider - 8.2.1 - 2015-12-02 21:43:14 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem ) {

	var rect = elem.getBoundingClientRect(),
		doc = elem.ownerDocument,
		docElem = doc.documentElement,
		pageOffset = getPageOffset();

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return {
			top: rect.top + pageOffset.y - docElem.clientTop,
			left: rect.left + pageOffset.x - docElem.clientLeft
		};
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Rounds a number to 7 supported decimals.
	function accurateNumber( number ) {
		var p = Math.pow(10, 7);
		return Number((Math.round(number*p)/p).toFixed(7));
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		addClass(element, className);
		setTimeout(function(){
			removeClass(element, className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// http://youmightnotneedjquery.com/#has_class
	function hasClass ( el, className ) {
		if ( el.classList ) {
			el.classList.contains(className);
		} else {
			new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( ) {

		var supportPageOffset = window.pageXOffset !== undefined,
			isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
			x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
			y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// Shorthand for stopPropagation so we don't have to create a dynamic method
	function stopPropagation ( e ) {
		e.stopPropagation();
	}

	// todo
	function addCssPrefix(cssPrefix) {
		return function(className) {
			return cssPrefix + className;
		};
	}


	var
	// Determine the events to bind. IE11 implements pointerEvents without
	// a prefix, which breaks compatibility with the IE10 implementation.
	/** @const */
	actions = window.navigator.pointerEnabled ? {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup'
	} : window.navigator.msPointerEnabled ? {
		start: 'MSPointerDown',
		move: 'MSPointerMove',
		end: 'MSPointerUp'
	} : {
		start: 'mousedown touchstart',
		move: 'mousemove touchmove',
		end: 'mouseup touchend'
	},
	defaultCssPrefix = 'noUi-';


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return accurateNumber(fromStepping( this.xVal, this.xPct, value ));
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0,
			hover = entry.indexOf('hover') >= 0;

		// Fix #472
		if ( drag && !parsed.connect ) {
			throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testTooltips ( parsed, entry ) {

		var i;

		if ( entry === false ) {
			return;
		} else if ( entry === true ) {

			parsed.tooltips = [];

			for ( i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}

		} else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider: must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' ) {
			throw new Error( "noUiSlider: 'cssPrefix' must be a string.");
		}

		parsed.cssPrefix = entry;
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal'
		};

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}


function closure ( target, options ){

	// All variables local to 'closure' are prefixed with 'scope_'
	var scope_Target = target,
		scope_Locations = [-1, -1],
		scope_Base,
		scope_Handles,
		scope_Spectrum = options.spectrum,
		scope_Values = [],
		scope_Events = {},
		scope_Self;

  var cssClasses = [
    /*  0 */  'target'
    /*  1 */ ,'base'
    /*  2 */ ,'origin'
    /*  3 */ ,'handle'
    /*  4 */ ,'horizontal'
    /*  5 */ ,'vertical'
    /*  6 */ ,'background'
    /*  7 */ ,'connect'
    /*  8 */ ,'ltr'
    /*  9 */ ,'rtl'
    /* 10 */ ,'draggable'
    /* 11 */ ,''
    /* 12 */ ,'state-drag'
    /* 13 */ ,''
    /* 14 */ ,'state-tap'
    /* 15 */ ,'active'
    /* 16 */ ,''
    /* 17 */ ,'stacking'
    /* 18 */ ,'tooltip'
    /* 19 */ ,''
    /* 20 */ ,'pips'
    /* 21 */ ,'marker'
    /* 22 */ ,'value'
  ].map(addCssPrefix(options.cssPrefix || defaultCssPrefix));


	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0,
			mouse = e.type.indexOf('mouse') === 0,
			pointer = e.type.indexOf('pointer') === 0,
			x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		pageOffset = pageOffset || getPageOffset();

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		event.pageOffset = pageOffset;
		event.points = [x, y];
		event.cursor = mouse || pointer; // Fix #435

		return event;
	}

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var origin = document.createElement('div'),
			handle = document.createElement('div'),
			additions = [ '-lower', '-upper' ];

		if ( direction ) {
			additions.reverse();
		}

		addClass(handle, cssClasses[3]);
		addClass(handle, cssClasses[3] + additions[index]);

		addClass(origin, cssClasses[2]);
		origin.appendChild(handle);

		return origin;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	addClass(target, cssClasses[7]);
					addClass(handles[0], cssClasses[6]);
					break;
			case 3: addClass(handles[1], cssClasses[6]);
					/* falls through */
			case 2: addClass(handles[0], cssClasses[7]);
					/* falls through */
			case 0: addClass(target, cssClasses[6]);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( base.appendChild(addHandle( direction, index )) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		addClass(target, cssClasses[0]);
		addClass(target, cssClasses[8 + direction]);
		addClass(target, cssClasses[4 + orientation]);

		var div = document.createElement('div');
		addClass(div, cssClasses[1]);
		target.appendChild(div);
		return div;
	}


	function addTooltip ( handle, index ) {

		if ( !options.tooltips[index] ) {
			return false;
		}

		var element = document.createElement('div');
		element.className = cssClasses[18];
		return handle.firstChild.appendChild(element);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( ) {

		if ( options.dir ) {
			options.tooltips.reverse();
		}

		// Tooltips are added with options.tooltips in original order.
		var tips = scope_Handles.map(addTooltip);

		if ( options.dir ) {
			tips.reverse();
			options.tooltips.reverse();
		}

		bindEvent('update', function(f, o, r) {
			if ( tips[o] ) {
				tips[o].innerHTML = options.tooltips[o] === true ? f[o] : options.tooltips[o].to(r[o]);
			}
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values-1) ), v, i = 0;
			values = [];

			// List these parts and have them handled as 'positions'.
			while ((v=i++*spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var originalSpectrumDirection = scope_Spectrum.direction,
			indexes = {},
			firstInRange = scope_Spectrum.xVal[0],
			lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],
			ignoreFirst = false,
			ignoreLast = false,
			prevPct = 0;

		// This function loops the spectrum in an ltr linear fashion,
		// while the toStepping method is direction aware. Trick it into
		// believing it is ltr.
		scope_Spectrum.direction = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step, i, q,
				low = current,
				high = group[index+1],
				newPct, pctDifference, pctPos, type,
				steps, realSteps, stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		// Reset the spectrum.
		scope_Spectrum.direction = originalSpectrumDirection;

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var style = ['horizontal', 'vertical'][options.ort],
			element = document.createElement('div');

		addClass(element, cssClasses[20]);
		addClass(element, cssClasses[20] + '-' + style);

		function getSize( type ){
			return [ '-normal', '-large', '-sub' ][type];
		}

		function getTags( offset, source, values ) {
			return 'class="' + source + ' ' +
				source + '-' + style + ' ' +
				source + getSize(values[1]) +
				'" style="' + options.style + ': ' + offset + '%"';
		}

		function addSpread ( offset, values ){

			if ( scope_Spectrum.direction ) {
				offset = 100 - offset;
			}

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			element.innerHTML += '<div ' + getTags(offset, cssClasses[21], values) + '></div>';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				element.innerHTML += '<div '+getTags(offset, cssClasses[22], values)+'>' + formatter.to(values[0]) + '</div>';
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});

		return element;
	}

	function pips ( grid ) {

	var mode = grid.mode,
		density = grid.density || 1,
		filter = grid.filter || false,
		values = grid.values || false,
		stepped = grid.stepped || false,
		group = getGroup( mode, values, stepped ),
		spread = generateSpread( density, mode, group ),
		format = grid.format || {
			to: Math.round
		};

		return scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));
	}


	// Shorthand for base dimensions.
	function baseSize ( ) {
		return scope_Base['offset' + ['Width', 'Height'][options.ort]];
	}

	// External event handling
	function fireEvent ( event, handleNumber, tap ) {

		if ( handleNumber !== undefined && options.handles !== 1 ) {
			handleNumber = Math.abs(handleNumber - options.dir);
		}

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( event === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					// .reverse is in place
					// Return values as array, so arg_1[arg_2] is always valid.
					callback.call(scope_Self, asArray(valueGet()), handleNumber, asArray(inSliderOrder(Array.prototype.slice.call(scope_Values))), tap || false);
				});
			}
		});
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			if ( scope_Target.hasAttribute('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, cssClasses[14]) ) {
				return false;
			}

			e = fixEvent(e, data.pageOffset);

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( data.hover && e.buttons ) {
				return false;
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );

		}, methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons and .which zero on mousemove.
		// Firefox breaks the spec MDN defines.
		if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
			return end(event, data);
		}

		var handles = data.handles || scope_Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
			handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[handleNumber], handles.length === 1 );

		if ( handles.length > 1 ) {

			state = setHandle ( handles[1], positions[handleNumber?0:1], false ) || state;

			if ( state ) {
				// fire for both handles
				for ( i = 0; i < data.handles.length; i++ ) {
					fireEvent('slide', i);
				}
			}
		} else if ( state ) {
			// Fire for a single handle
			fireEvent('slide', handleNumber);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event, data ) {

		// The handle is no longer active, so remove the class.
		var active = scope_Base.querySelector( '.' + cssClasses[15] ),
			handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

		if ( active !== null ) {
			removeClass(active, cssClasses[15]);
		}

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			document.body.style.cursor = '';
			document.body.removeEventListener('selectstart', document.body.noUiListener);
		}

		var d = document.documentElement;

		// Unbind the move and end events, which are added on 'start'.
		d.noUiListeners.forEach(function( c ) {
			d.removeEventListener(c[0], c[1]);
		});

		// Remove dragging class.
		removeClass(scope_Target, cssClasses[12]);

		// Fire the change and set events.
		fireEvent('set', handleNumber);
		fireEvent('change', handleNumber);

		// If this is a standard handle movement, fire the end event.
		if ( data.handleNumber !== undefined ) {
			fireEvent('end', data.handleNumber);
		}
	}

	// Fire 'end' when a mouse or pen leaves the document.
	function documentLeave ( event, data ) {
		if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
			end ( event, data );
		}
	}

	// Bind move events on document.
	function start ( event, data ) {

		var d = document.documentElement;

		// Mark the handle as 'active' so it can be styled.
		if ( data.handles.length === 1 ) {
			addClass(data.handles[0].children[0], cssClasses[15]);

			// Support 'disabled' handles
			if ( data.handles[0].hasAttribute('disabled') ) {
				return false;
			}
		}

		// Fix #551, where a handle gets selected instead of dragged.
		event.preventDefault();

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move and end events.
		var moveEvent = attach(actions.move, d, move, {
			start: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handles: data.handles,
			handleNumber: data.handleNumber,
			buttonsProperty: event.buttons,
			positions: [
				scope_Locations[0],
				scope_Locations[scope_Handles.length - 1]
			]
		}), endEvent = attach(actions.end, d, end, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		var outEvent = attach("mouseout", d, documentLeave, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		d.noUiListeners = moveEvent.concat(endEvent, outEvent);

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			document.body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, cssClasses[12]);
			}

			var f = function(){
				return false;
			};

			document.body.noUiListener = f;

			// Prevent text selection when dragging the handles.
			document.body.addEventListener('selectstart', f, false);
		}

		if ( data.handleNumber !== undefined ) {
			fireEvent('start', data.handleNumber);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, handleNumber, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		scope_Handles.forEach(function(a){
			total += offset(a)[ options.style ];
		});

		// Find the handle closest to the tapped position.
		handleNumber = ( location < total/2 || scope_Handles.length === 1 ) ? 0 : 1;

		location -= offset(scope_Base)[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Support 'disabled' handles
		if ( scope_Handles[handleNumber].hasAttribute('disabled') ) {
			return false;
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( scope_Handles[handleNumber], to );

		fireEvent('slide', handleNumber, true);
		fireEvent('set', handleNumber, true);
		fireEvent('change', handleNumber, true);

		if ( options.events.snap ) {
			start(event, { handles: [scope_Handles[handleNumber]] });
		}
	}

	// Fires a 'hover' event for a hovered mouse/pen position.
	function hover ( event ) {

		var location = event.calcPoint - offset(scope_Base)[ options.style ],
			to = scope_Spectrum.getStep(( location * 100 ) / baseSize()),
			value = scope_Spectrum.fromStepping( to );

		Object.keys(scope_Events).forEach(function( targetEvent ) {
			if ( 'hover' === targetEvent.split('.')[0] ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					callback.call( scope_Self, value );
				});
			}
		});
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		var i, drag;

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			for ( i = 0; i < scope_Handles.length; i += 1 ) {

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, scope_Handles[i].children[0], start, {
					handles: [ scope_Handles[i] ],
					handleNumber: i
				});
			}
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, scope_Base, tap, {
				handles: scope_Handles
			});
		}

		// Fire hover events
		if ( behaviour.hover ) {
			attach ( actions.move, scope_Base, hover, { hover: true } );
			for ( i = 0; i < scope_Handles.length; i += 1 ) {
				['mousemove MSPointerMove pointermove'].forEach(function( eventName ){
					scope_Handles[i].children[0].addEventListener(eventName, stopPropagation, false);
				});
			}
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			drag = [scope_Base.querySelector( '.' + cssClasses[7] )];
			addClass(drag[0], cssClasses[10]);

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
			}

			drag.forEach(function( element ) {
				attach ( actions.start, element, start, {
					handles: scope_Handles
				});
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle !== scope_Handles[0] ? 1 : 0,
			lowerMargin = scope_Locations[0] + options.margin,
			upperMargin = scope_Locations[1] - options.margin,
			lowerLimit = scope_Locations[0] + options.limit,
			upperLimit = scope_Locations[1] - options.limit;

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && scope_Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = scope_Spectrum.getStep( to );

		// Limit to 0/100 for .val input, trim anything beyond 7 digits, as
		// JavaScript has some issues in its floating point implementation.
		to = limit(parseFloat(to.toFixed(7)));

		// Return false if handle can't move
		if ( to === scope_Locations[trigger] ) {
			return false;
		}

		// Set the handle to the new position.
		// Use requestAnimationFrame for efficient painting.
		// No significant effect in Chrome, Edge sees dramatic
		// performace improvements.
		if ( window.requestAnimationFrame ) {
			window.requestAnimationFrame(function(){
				handle.style[options.style] = to + '%';
			});
		} else {
			handle.style[options.style] = to + '%';
		}

		// Force proper handle stacking
		if ( !handle.previousSibling ) {
			removeClass(handle, cssClasses[17]);
			if ( to > 50 ) {
				addClass(handle, cssClasses[17]);
			}
		}

		// Update locations.
		scope_Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[trigger] = scope_Spectrum.fromStepping( to );

		fireEvent('update', trigger);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( scope_Handles[trigger], scope_Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
					fireEvent('update', trigger);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input ) {

		var count, values = asArray( input ), i;

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated placement.
		if ( options.animate && scope_Locations[0] !== -1 ) {
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Determine how often to set the handles.
		count = scope_Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event for both handles.
		for ( i = 0; i < scope_Handles.length; i++ ) {
			fireEvent('set', i);
		}
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( scope_Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {
		cssClasses.forEach(function(cls){
			if ( !cls ) { return; } // Ignore empty classes
			removeClass(scope_Target, cls);
		});
		scope_Target.innerHTML = '';
		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = scope_Locations.map(function( location, index ){

			var step = scope_Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = scope_Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [decrement, increment];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent.split('.')[0],
			namespace = namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0],
				tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}

	// Updateable: margin, limit, step, range, animate, snap
	function updateOptions ( optionsToUpdate ) {

		var v = valueGet(), i, newOptions = testOptions({
			start: [0, 0],
			margin: optionsToUpdate.margin,
			limit: optionsToUpdate.limit,
			step: optionsToUpdate.step,
			range: optionsToUpdate.range,
			animate: optionsToUpdate.animate,
			snap: optionsToUpdate.snap === undefined ? options.snap : optionsToUpdate.snap
		});

		['margin', 'limit', 'step', 'range', 'animate'].forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				options[name] = optionsToUpdate[name];
			}
		});

		scope_Spectrum = newOptions.spectrum;

		// Invalidate the current positioning so valueSet forces an update.
		scope_Locations = [-1, -1];
		valueSet(v);

		for ( i = 0; i < scope_Handles.length; i++ ) {
			fireEvent('update', i);
		}
	}


	// Throw an error if the slider was already initialized.
	if ( scope_Target.noUiSlider ) {
		throw new Error('Slider was already initialized.');
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	scope_Base = addSlider( options.dir, options.ort, scope_Target );
	scope_Handles = addHandles( options.handles, options.dir, scope_Base );

	// Set the connect classes.
	addConnection ( options.connect, scope_Target, scope_Handles );

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips();
	}

	scope_Self = {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		updateOptions: updateOptions
	};

	// Attach user events.
	events( options.events );

	return scope_Self;

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target.nodeName ) {
			throw new Error('noUiSlider.create requires a single element.');
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target ),
			slider = closure( target, options );

		// Use the public value method to set the start values.
		slider.set(options.start);

		target.noUiSlider = slider;
		return slider;
	}

	// Use an object instead of a function for future expansibility;
	return {
		create: initialize
	};

}));
