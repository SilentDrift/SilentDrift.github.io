$(function() {
    var initialHeight = 300; // Base height for all windows
    var minWidth = 300; // Minimum width for any window
    var grid = 20; // Grid size for snapping
    var zIndexCounter = 1000; // Initial z-index counter

    function resizeImageWindow($item) {
        var img = $item.find('img')[0];
        var aspectRatio = img.naturalWidth / img.naturalHeight;
        var widthBasedOnHeight = initialHeight * aspectRatio;

        $item.css({
            width: widthBasedOnHeight + 'px',
            height: initialHeight + 'px'
        });
    }

    $(".grid-container .item").each(function() {
        var $this = $(this);

        if ($this.hasClass('image-item')) {
            var img = $this.find('img')[0];

            if (img.complete) {
                resizeImageWindow($this);
            } else {
                $(img).on('load', function() {
                    resizeImageWindow($this);
                });
            }
        } else {
            var contentWidth = $this.find('pre').outerWidth() + 20; // Allow for padding
            var adjustedWidth = Math.max(minWidth, Math.min(contentWidth, 500)); // Max width for text windows

            // Specific adjustment for About_me.txt and Things_I_Believe.tex windows
            if ($this.attr('id') === 'about-me' || $this.attr('id') === 'things-i-believe') {
                adjustedWidth = Math.min(contentWidth, 400); // Smaller width for specific windows
            }

            $this.css({
                width: adjustedWidth + 'px',
                height: initialHeight + 'px'
            });
        }
    }).draggable({
        handle: ".window-header",
        stack: ".item",
        grid: [grid, grid],
        start: function(event, ui) {
            zIndexCounter++;
            $(this).css("z-index", zIndexCounter);
        },
        stop: function(event, ui) {
            $(this).css("z-index", zIndexCounter);
        }
    }).resizable({
        minHeight: 200,
        minWidth: 300,
        grid: grid,
        start: function(event, ui) {
            zIndexCounter++;
            $(this).addClass('resizing').css("z-index", zIndexCounter);
        },
        stop: function(event, ui) {
            $(this).removeClass('resizing').css("z-index", zIndexCounter);
        }
    });
});

function closeSection(element) {
    $(element).closest('.item').hide();
}
