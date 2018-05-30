app.controller('action', function($scope, $rootScope, $http) {
    
    $scope.optionlist = [
        {"value": 'chill', "name": "Office"},
        {"value": 'info',"name": "Meeting"},
        {"value": 'important',"name": "Appointment"},
        {"value": 'success',"name": "Travel"},
        {"value": 'ready',"name": "Busy"}
    ];
        
    $scope.selectionValidator = function(){
        if ($scope.className != "" && $scope.className != undefined && $scope.className != 0){
            $scope.selectError = false;
        }else{
            $scope.selectError = true;
        }
    }

    $scope.addModal = function(){
        angular.element('#new-modal').modal('show');
    }
    
    $scope.newEvent = function(){
        
        let title       =  $scope.title;
        let description =  $scope.description;
        let className   =  $scope.className;
        let start       =  $scope.start;
        let end         =  $scope.end;
        
        $http.post('http://localhost:3000/newEvent', {params: {title: title, description: description, start: start, end: end, className: className}}).then(function (httpResponse) {
            if (httpResponse.data.status === 200) {
                $('#calendar').fullCalendar("refetchEvents");
                new NotificationHelper.NotificationHelpers().success('Congrats! Your Event Was Created Successfully!', 2);
                angular.element("#EventForm")[0].reset();
                angular.element('#new-modal').modal('hide');
            }else{
                new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
            }
        });
    }

    
    $scope.deleteEvent = function(id){
        new NotificationHelper.NotificationHelpers().confirm('Are You Sure You Want To Delete This Event ?', function(){
            new NotificationHelper.NotificationHelpers().error('Aw, why not? :(', 2);
        }, function(){
            $http({
                url: 'http://localhost:3000/deleteEvents',
                method: 'DELETE',
                data: {id: id},
                headers: {"Content-Type": "application/json;charset=utf-8"}
            }).then(function(res){
                $('#calendar').fullCalendar("refetchEvents");
                new NotificationHelper.NotificationHelpers().success('The Selected Event Has Been Successfully Deleted!', 2);
            }, function(error) {
                new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
            });            
        });
    }
    
    $scope.editEvent = function(){
        
        let id           = angular.element('#edit-modal #id').val();
        let description  = angular.element('#edit-modal #description').val();
        let title        = angular.element('#edit-modal #title').val();
        let className    = angular.element('#edit-modal #className').val(); 
        let start        = angular.element('#edit-modal #start').val();
        let end          = angular.element('#edit-modal #end').val();
        
        $http.post('http://localhost:3000/updateEvents', {params: {id: id, title: title, description: description, start: start, end: end, className: className}}).then(function (httpResponse) {
            if (httpResponse.data.status === 200) {
                $('#calendar').fullCalendar("refetchEvents");
                new NotificationHelper.NotificationHelpers().success('Congrats! Your Event Was Updated Successfully!', 2);
                angular.element('#edit-modal').modal('hide');
            }else{
                new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
            }
        });        
    }
           
    $('#calendar').fullCalendar({          
                header: {
                    left: 'today',
                    center: 'prev title next',
                    right: 'month,basicWeek,basicDay'                
                },
                buttonText: {
                prev: "",
                next: "",
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day'
                },
                defaultDate: moment(),
                editable: true,
                eventLimit: true, 
                selectable: true,
                selectHelper: true,
                events: {
                    url: 'http://localhost:3000/getEvents',
                    type: 'GET',
                    error: function() {
                        console.log('Error!- This request could not be completed');
                    },
                    success: function(response) {
                        $scope.drawerEvents = response;
                        $scope.$apply();
                        angular.element('.fc-center').find('h2').attr('ng-model', 'currmonth');
                    },
                },
                select: function(start, end) {
                    $scope.start = moment(start).format('YYYY-MM-DD');
                    $scope.end = moment(end).format('YYYY-MM-DD');
                    angular.element('#new-modal').modal('show');
                    $scope.$apply();
                },
                eventRender: function(event, element) {
                    element.bind('dblclick', function() {
                        angular.element('#edit-modal #id').val(event.id);
                        angular.element('#edit-modal #title').val(event.title);
                        angular.element('#edit-modal #description').val(event.description);
                        angular.element('#edit-modal #className').val(event.className); 
                        angular.element('#edit-modal #start').val(moment(event.start).format('YYYY-MM-DD'));
                        if(angular.element('#edit-modal #end').val() == '' || angular.element('#edit-modal #end').val() == null){
                            angular.element('#edit-modal #end').val(angular.copy(moment(event.start).format('YYYY-MM-DD')));
                        }else{
                            angular.element('#edit-modal #end').val(moment(event.end).format('YYYY-MM-DD')); 
                        }
                        angular.element('#edit-modal').modal('show');
                    });
                },
                eventDrop: function(event, delta, revertFunc) {
                    editCalendar(event);
                },
                eventResize: function(event,dayDelta,minuteDelta,revertFunc){
                    editCalendar(event);
                },
                eventDragStop: function (event, jsEvent, ui, view) {
                    if (isElemOverDiv()) {                        
                        new NotificationHelper.NotificationHelpers().confirm('Are You Sure You Want To Delete This Event ?', function(){
                            new NotificationHelper.NotificationHelpers().error('Aw, why not? :(', 2);
                        }, function(){
                            $http({
                                url: 'http://localhost:3000/deleteEvents',
                                method: 'DELETE',
                                data: {id: event.id},
                                headers: {"Content-Type": "application/json;charset=utf-8"}
                            }).then(function(res){
                                $('#calendar').fullCalendar("refetchEvents");
                                new NotificationHelper.NotificationHelpers().success('The Selected Event Has Been Successfully Deleted!', 2);
                            }, function(error) {
                                new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
                            });     
                        });
                    }
                },
                eventMouseover:function (calEvent){
                    $(this).popover({
                        trigger:'hover',
                        title:calEvent.title,
                        container:"body",
                        placement:'auto',
                        animation: true,
                        html: true,  
                        content: function () {
                            if(calEvent.end == '' || calEvent.end == null){
                                calEvent.end = angular.copy(calEvent.start);
                            }
                            return '<div class="col-xs-3"><h5 class="popover-content-date-month">'+moment(calEvent.start).format('MMM')+'</h5><p class="popover-content-description text-success">'+moment(calEvent.start).format('DD')+'</p><h5 class="popover-content-date-month">'+moment(calEvent.end).format('MMM')+'</h5><p class="popover-content-description text-warning">'+moment(calEvent.end).format('DD')+'</p></div><div class="col-xs-9 pb-10"><p class="popover-content-date-month">'+calEvent.description+'</p></div>';
                        }
                    });
                }              
        });     
    
    function editCalendar(event){
        start = event.start.format('YYYY-MM-DD');
        if(event.end){
            end = event.end.format('YYYY-MM-DD');
        }else{
            end = start;
        }

        id          = event.id;
        title       = event.title;
        className   = event.className;
        description = event.description;
        
        $http.post('http://localhost:3000/updateEvents', {params: {id: id, title: title, description: description, start: start, end: end, className: className}}).then(function (httpResponse) {
            if (httpResponse.data.status === 200) {
                $('#calendar').fullCalendar("refetchEvents");
                new NotificationHelper.NotificationHelpers().success('Congrats! Your Event Was Updated Successfully!', 2);
            }else{
                new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
            }
        });             
    }

    
    let currentMousePos = {
        x: -1,
        y: -1
    };
    
    $(document).on("mousemove", function (event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });
    
    
    function isElemOverDiv() {
        let trashEl = $('#trash');
        let ofs = trashEl.offset();
        let x1 = ofs.left;
        let x2 = ofs.left + trashEl.outerWidth(true);
        let y1 = ofs.top;
        let y2 = ofs.top + trashEl.outerHeight(true);
        if (currentMousePos.x >= x1 && currentMousePos.x <= x2 &&
            currentMousePos.y >= y1 && currentMousePos.y <= y2) {
            return true;
        }
        return false;
    }
});
