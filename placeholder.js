$(document).ready(function() {
    
    /* Placeholder for IE */
    if($.browser.msie) { // Условие для вызова только в IE
        $("form").find("[placeholder]").each(function() {
            var tp = $(this).attr("placeholder");
            $(this).attr('value',tp).css('color','#434343;');
        }).focusin(function() {
            var val = $(this).attr('placeholder');
            if($(this).val() == val) {
                $(this).attr('value','').css('color','#434343');
            }
        }).focusout(function() {
            var val = $(this).attr('placeholder');
            if($(this).val() == "") {
                $(this).attr('value', val).css('color','#434343');
            }
        });

        /* Protected send form */
        $("form").submit(function() {
            $(this).find("[placeholder]").each(function() {
                var val = $(this).attr('placeholder');
                if($(this).val() == val) {
                    $(this).attr('value','');
                }
            })
        });
    }
});