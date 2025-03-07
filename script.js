$(function() {
    var initialHeight = 300; // Base height for all windows
    var minWidth = 300; // Minimum width for any window
    var grid = 20; // Grid size for snapping
    var zIndexCounter = 1000; // Initial z-index counter

    function resizeImageWindow($item) {
        var img = $item.find('img')[0];
        if (!img || !img.complete || !img.naturalWidth) {
            // If image hasn't loaded yet, try again later
            setTimeout(function() { resizeImageWindow($item); }, 100);
            return;
        }
        
        var aspectRatio = img.naturalWidth / img.naturalHeight;
        var widthBasedOnHeight = initialHeight * aspectRatio;

        $item.css({
            width: widthBasedOnHeight + 'px',
            height: initialHeight + 'px'
        });
        
        // Store aspect ratio for later use
        $item.data('aspect-ratio', aspectRatio);
    }

    function adjustWindowsForScreenSize() {
        var windowWidth = $(window).width();
        var containerWidth = $(".grid-container").width();
        
        $(".grid-container .item").each(function() {
            var $this = $(this);
            
            // For small browser windows - when only one window fits per row
            if (windowWidth <= 768) {
                // Store original position before adjusting
                if (!$this.data('original-position')) {
                    $this.data('original-position', {
                        left: $this.css('left'),
                        top: $this.css('top'),
                        width: $this.css('width'),
                        height: $this.css('height')
                    });
                }
                
                // Make all windows fit the container width
                if ($this.hasClass('image-item')) {
                    // For image windows, maintain aspect ratio but make them fit container width
                    var img = $this.find('img')[0];
                    if (img && img.complete) {
                        var aspectRatio = $this.data('aspect-ratio') || img.naturalWidth / img.naturalHeight;
                        var newWidth = containerWidth - 40; // Account for padding and margins
                        var newHeight = newWidth / aspectRatio;
                        
                        $this.css({
                            'width': newWidth + 'px',
                            'height': newHeight + 'px'
                        });
                    }
                } else {
                    // For text windows, just fit container width
                    $this.css('width', (containerWidth - 40) + 'px');
                }
                
                // Reset position to avoid windows being off-screen
                $this.css({
                    'left': '',
                    'top': ''
                });
            } else {
                // For larger screens, restore original position and size if it was saved
                var originalPosition = $this.data('original-position');
                if (originalPosition && !$this.data('user-modified')) {
                    $this.css({
                        'left': originalPosition.left,
                        'top': originalPosition.top
                    });
                    
                    // Restore original window dimensions
                    if ($this.hasClass('image-item')) {
                        resizeImageWindow($this);
                    } else {
                        var contentWidth = $this.find('pre').outerWidth() + 20;
                        var adjustedWidth = Math.max(minWidth, Math.min(contentWidth, 500));
                        
                        if ($this.attr('id') === 'about-me' || $this.attr('id') === 'things-i-believe') {
                            adjustedWidth = Math.min(contentWidth, 400);
                        }
                        
                        $this.css({
                            'width': adjustedWidth + 'px',
                            'height': initialHeight + 'px'
                        });
                    }
                }
            }
        });
    }

    // Function to resize window to fit content
    function resizeToFitContent($item) {
        if ($item.hasClass('image-item')) {
            // For images, just restore the original aspect ratio
            resizeImageWindow($item);
        } else {
            // For text items, calculate ideal dimensions based on content
            var $content = $item.find('pre');
            var contentWidth = $content.get(0).scrollWidth + 40; // Add padding
            var contentHeight = $content.get(0).scrollHeight + 60; // Add padding for header
            
            // Apply reasonable constraints
            contentWidth = Math.max(minWidth, Math.min(contentWidth, 600));
            contentHeight = Math.max(200, Math.min(contentHeight, 600));
            
            $item.css({
                'width': contentWidth + 'px',
                'height': contentHeight + 'px'
            });
        }
        
        // Mark as user-modified
        $item.data('user-modified', true);
    }

    // Initialize windows one by one to prevent conflicts
    function initializeWindows() {
        // First make them draggable
        $(".grid-container .item").each(function() {
            var $this = $(this);
            
            // Initialize draggable
            $this.draggable({
                handle: ".window-header",
                stack: ".item",
                grid: [grid, grid],
                start: function(event, ui) {
                    zIndexCounter++;
                    $(this).css("z-index", zIndexCounter);
                },
                stop: function(event, ui) {
                    // Mark as user-modified to prevent automatic repositioning
                    $(this).data('user-modified', true);
                    $(this).css("z-index", zIndexCounter);
                }
            });
            
            // Store aspect ratio for image items
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
                var contentWidth = $this.find('pre').outerWidth() + 20;
                var adjustedWidth = Math.max(minWidth, Math.min(contentWidth, 500));
                
                if ($this.attr('id') === 'about-me' || $this.attr('id') === 'things-i-believe') {
                    adjustedWidth = Math.min(contentWidth, 400);
                }
                
                $this.css({
                    width: adjustedWidth + 'px',
                    height: initialHeight + 'px'
                });
            }
        });
        
        // Then make them resizable after a slight delay
        setTimeout(function() {
            $(".grid-container .item").each(function() {
                var $this = $(this);
                
                // Initialize resizable with basic options first
                $this.resizable({
                    minHeight: 200,
                    minWidth: 300,
                    grid: grid,
                    handles: "all", // Add resize handles to all corners and edges
                    start: function(event, ui) {
                        zIndexCounter++;
                        $(this).addClass('resizing').css("z-index", zIndexCounter);
                    },
                    stop: function(event, ui) {
                        $(this).data('user-modified', true);
                        $(this).removeClass('resizing').css("z-index", zIndexCounter);
                    }
                });
            });
            
            // Add aspect ratio preservation after windows are properly initialized
            setTimeout(function() {
                // Double-click on window header to fit content
                $(".window-header").dblclick(function(e) {
                    // Ignore if clicked on close button
                    if (!$(e.target).hasClass('close-btn')) {
                        var $item = $(this).closest('.item');
                        resizeToFitContent($item);
                    }
                });
                
                // Shift key for maintaining aspect ratio during resize
                $(document).keydown(function(e) {
                    if (e.shiftKey) {
                        $(".grid-container .item").each(function() {
                            var $this = $(this);
                            if ($this.hasClass('resizing')) {
                                $this.data('preserve-aspect-ratio', true);
                            }
                        });
                    }
                }).keyup(function(e) {
                    if (!e.shiftKey) {
                        $(".grid-container .item").each(function() {
                            $(this).data('preserve-aspect-ratio', false);
                        });
                    }
                });
                
                // Initialize aspect ratio in the resizable
                $(".grid-container .item").each(function() {
                    var $this = $(this);
                    
                    // Add aspect ratio handling to existing resizable
                    if ($this.hasClass('image-item')) {
                        var aspectRatio = $this.data('aspect-ratio');
                        if (aspectRatio) {
                            $this.resizable('option', 'aspectRatio', false);
                            
                            // Add a custom resize handler that checks for Shift key
                            $this.on('resize', function(event, ui) {
                                if ($(this).data('preserve-aspect-ratio')) {
                                    var aspectRatio = $(this).data('aspect-ratio');
                                    if (aspectRatio) {
                                        var width = ui.size.width;
                                        var height = width / aspectRatio;
                                        ui.size.height = height;
                                    }
                                }
                            });
                        }
                    }
                });
            }, 200);
        }, 200);
    }

    // Run initialization sequence
    initializeWindows();
    
    // Run on page load
    adjustWindowsForScreenSize();
    
    // Run when window is resized
    $(window).resize(function() {
        adjustWindowsForScreenSize();
    });
});

function closeSection(element) {
    $(element).closest('.item').hide();
}