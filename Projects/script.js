$(function() {
    var initialHeight = 300; // Base height for all windows
    var grid = 20; // Grid size for snapping
    var zIndexCounter = 1000; // Initial z-index counter

    function resizeImageWindow($item) {
        var img = $item.find('img')[0];
        var aspectRatio = img.naturalWidth / img.naturalHeight;
        var widthBasedOnHeight = initialHeight * aspectRatio;

        $item.css({
            width: 'calc(50% - 20px)',
            height: initialHeight + 'px'
        });
    }

    function calculateMinWidth($item) {
        var textContainer = $item.find('.text-container pre')[0];
        var range = document.createRange();
        range.selectNodeContents(textContainer);
        var textWidth = range.getBoundingClientRect().width;
        var padding = 20; // Adjust according to your padding
        return textWidth + padding;
    }

    $(".grid-container .item").each(function() {
        var $this = $(this);
        var initialWidth = $(window).width() / 2 - 20;
        var minWidth = $(window).width() / 4;
        var maxWidth = $(window).width();
        var maxHeight = $(window).height() / 2;

        if ($this.find('.image-container img').length) {
            var img = $this.find('.image-container img')[0];

            if (img.complete) {
                resizeImageWindow($this);
            } else {
                $(img).on('load', function() {
                    resizeImageWindow($this);
                });
            }
        } else {
            $this.css({
                width: initialWidth + 'px',
                height: initialHeight + 'px'
            });
        }

        $this.resizable({
            containment: "body",
            minHeight: initialHeight, // Set min height to initial height
            maxHeight: maxHeight,
            minWidth: minWidth,
            maxWidth: maxWidth,
            grid: grid,
            start: function(event, ui) {
                zIndexCounter++;
                $(this).addClass('resizing').css("z-index", zIndexCounter);
            },
            stop: function(event, ui) {
                $(this).removeClass('resizing').css("z-index", zIndexCounter);
            }
        });
    }).draggable({
        containment: "body",
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
    });

    // Function to toggle single-column layout when viewport width is < 2/3 of the physical screen width
    function updateLayout() {
        var ratio = $(window).width() / window.screen.width; // viewport width divided by screen width
        if (ratio <= 0.6667) {
            $(".grid-container").addClass("single-column");
        } else {
            $(".grid-container").removeClass("single-column");
        }
    }

    // Initial call and event binding
    updateLayout();
    $(window).on("resize", updateLayout);
});

function closeSection(element) {
    $(element).closest('.item').hide();
}

function minimizeWindow(element) {
    var $item = $(element).closest('.item');
    var id = $item.attr('id');
    var title = $item.find('.title').text();
    $item.hide();
    addToTaskbar(id, title);
}

function maximizeWindow(element) {
    var $item = $(element).closest('.item');
    var isMaximized = $item.data('isMaximized');
    if (isMaximized) {
        $item.css({
            width: $item.data('originalWidth'),
            height: $item.data('originalHeight'),
            top: $item.data('originalTop'),
            left: $item.data('originalLeft')
        });
        $item.find('.window-content').slideDown();
        $item.data('isMaximized', false);
    } else {
        $item.data('originalWidth', $item.width());
        $item.data('originalHeight', $item.height());
        $item.data('originalTop', $item.position().top);
        $item.data('originalLeft', $item.position().left);
        $item.css({
            width: '100%',
            height: '100vh',
            top: 0,
            left: 0
        });
        $item.find('.window-content').slideDown();
        $item.data('isMaximized', true);
    }
}

function addToTaskbar(id, title) {
    var $taskbar = $('.taskbar');
    var $taskbarItem = $('<div>')
        .addClass('taskbar-item')
        .text(title)
        .attr('data-id', id)
        .on('click', function() {
            var windowId = $(this).attr('data-id');
            $('#' + windowId).show();
            $(this).remove();
        });
    $taskbar.append($taskbarItem);
}
