/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'imgUpload',
        defaults = {
            path: "/ajax/imgUpload",
            error_label : "There was a problem while uploading the image"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        var _this = this;
        this.readImg = function(inputi)
        {
            input = inputi[0];

            if ( input.files && input.files[0] ) {
            var FR= new FileReader();
            FR.onload = function(e) {
                _this.process(e.target.result);
             };       
            FR.readAsDataURL( input.files[0] );
            }
        }
        this.process = function(result){
            _this = this;
            console.log(_this.loadtarget);
            progress = $('<div class="progress"> \
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"> \
                <span class="sr-only">0% Completado</span> \
                </div>\
                </div>');
            $('.'+_this.loadtarget).prepend(progress)
            $.ajax({
                xhr: function()
                  {
                    var xhr = new window.XMLHttpRequest();
                    //Upload progress
                    xhr.upload.addEventListener("progress", function(evt){
                      if (evt.lengthComputable) {
                        
                        var percentComplete = evt.loaded / evt.total * 100;
                        //Do something with upload progress
                        
                        progress.children('.progress-bar').css({'width':percentComplete + '%'})
                      }
                    }, false);
                    
                    return xhr;
                  },
                url: _this.path,
                data: {id:_this.id, img: result},
                dataType: 'JSON',
                type: 'POST',
                success: function(data){
                    console.log(data);
                    var html = '';
                    $.each(data.img, function(k,i){
                        html += "<div class='col-md-12 nopad '><div class='col-md-3 img-loaded'><img class='img-responsive' src='/uploads/"+i+"' /></div></div>";
                    })
                    $('.'+_this.loadtarget).html(html)  


                }, 
                error: function(){
                    console.log(_this);
                     html = "<small>"+_this.options.error_label+"</small>";
                     $('.'+_this.loadtarget).html(html)  
                }

            })
        }
        this.init();
    }

    

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        console.log(this);
        this.path = $(this.element).attr('data-path');
        this.id = $(this.element).attr('data-id');
        this.loadtarget = $(this.element).attr('data-loadtarget');
        
        $(this.element).parent().find('input').remove();
        var imgElement = $('<input type="file" name="img" style="opacity:0; height:0px; width:0px" />');
        $(this.element).parent().append(imgElement);
        
        

        var _this = this;
        $(this.element).unbind('click');
        $(this.element).click(function(e){

                $(imgElement).unbind('click').click();
                $(imgElement).unbind('change').change(function(){
                   
                    var img = _this.readImg(imgElement);
                    

                })
                return false;
        })
        
       
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn.imgUpload = function ( options ) {
        
        return this.each(function () {
            var randId = Math.floor((Math.random() * 10000)+ 1);
            $.data(this, 'plugin_' + pluginName, 
            new Plugin( this, options ));
            //console.log($.data(this,'plugin_' + pluginName));

            
        });
    }

})( jQuery, window, document );