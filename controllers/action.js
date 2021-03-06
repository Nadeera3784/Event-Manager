const clipboard = require('electron').clipboard;
app.controller('action', function($scope, $rootScope, $http, ContextMenuEvents) {
    
    $scope.optionlist = [
        {"value": 'chill', "name": "Office"},
        {"value": 'info',"name": "Meeting"},
        {"value": 'important',"name": "Appointment"},
        {"value": 'success',"name": "Travel"},
        {"value": 'ready',"name": "Busy"},
		{"value": 'visit',"name": "Visit"}
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
	
	function resetForm(modalSelector, formSelector){
		$(modalSelector).on('hidden.bs.modal', function (e) {
			$(formSelector).find('input[type=text], textarea').val('');
			$(formSelector)[0].reset();
		});
	}
    
	$scope.menuOptions = [
		['<i class="fa fa-trash"></i> &nbsp;&nbsp; Delete', function ($itemScope) {
			$scope.deleteEvent($itemScope.event.id);
		}],
		['<i class="fa fa-send"></i> &nbsp;&nbsp; Send', function ($itemScope) {
			new NotificationHelper.NotificationHelpers().input(function(value){
				new NotificationHelper.NotificationHelpers().error('Aw, why not?', 2);
			}, function (value){
				$http.get('http://localhost:3000/getMailconfig').then(function successCallback(response) {
					if(response.data.length > 0){
						let subject = $itemScope.event.title;
						let text = $itemScope.event.description;
						let username = response.data[0]['mail_username'];
						let password = response.data[0]['mail_password'];
						new MailHelper.MailHelpers().send(value, subject, text, username,  password).then(function (response){
							new NotificationHelper.NotificationHelpers().success('Your event has been sent successfully.' , 2);
						});
					}else{
						new NotificationHelper.NotificationHelpers().warning('Unable to send event! <br> Please configure your email settings', 2);
					}

				}, function errorCallback(response) {
					console.log(response);
				});
			});
		}]
	];
	

	$scope.titleMenuOptions = [
		['Copy', function ($itemScope, event, modelValue, text, $li) {
			let copied_text = $itemScope.title;
			clipboard.writeText(copied_text);
		}],
		['Paste', function ($itemScope, event, modelValue, text, $li) {
			$scope.title = clipboard.readText();
		}]
	];
	$scope.descriptionMenuOptions = [
		['Copy', function ($itemScope, event, modelValue, text, $li) {
			let copied_text = $itemScope.description;
			clipboard.writeText(copied_text);
		}],
		['Paste', function ($itemScope, event, modelValue, text, $li) {
			$scope.description = clipboard.readText();
		}]
	];
	
	
    $scope.newEvent = function(){
		
		let title       =  $scope.title;
        let description =  $scope.description;
        let className   =  $scope.className;
        let start       =  $scope.start;
        let end         =  $scope.end;
        
        let valid = true;

		if(title == '' || title == null || title.length < 0){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please Enter A  Title', 2);
            valid = false;
        }else if(title != title.match(/^[a-z-0-9][a-z0-9_\ ./>]{1,12}$/i)){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Must have minimum 2 characters', 2);
            valid = false;
        }
        if(description == '' || description == null){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please enter a  description', 2);
            valid = false;
        }else if(description != description.match(/^[a-z-0-9][a-z0-9_\ ./,>]{4,100}$/i)){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Must have minimum 5 characters', 2);
            valid = false;
        }
        if(className == '' || className == null){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please select a  tag', 2);
            valid = false;
        }
		if(start == '' || start == null || start.length < 0){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please select s  start date', 2);
            valid = false;
        }
		if(end == '' || end == null || end.length < 0){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please select s  end date', 2);
            valid = false;
        }
        if(valid){
			$http.post('http://localhost:3000/newEvent', {params: {title: new SanitizeHelper.SanitizeHelpers().charScape(title), description: new SanitizeHelper.SanitizeHelpers().charScape(description), start: start, end: end, className: className}}).then(function (httpResponse) {
                if (httpResponse.data.status === 200) {
                    $('#calendar').fullCalendar("refetchEvents");
                    new NotificationHelper.NotificationHelpers().success('Congrats! Your New Event Was Created Successfully!', 2);
					$("#EventForm")[0].reset();
					resetForm('#new-modal', '#EventForm');
                    angular.element('#new-modal').modal('hide');
                }else{
                    new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
                }
            });          
        }
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

        let valid = true;
        
		if(title == '' || title == null || title.length < 0){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please enter a  title', 2);
            valid = false;
        }else if(title != title.match(/^[a-z-0-9][a-z0-9_\. />]{1,12}$/i)){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Must have minimum 2 characters', 2);
            valid = false;
        }
        if(description == '' || description == null){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please enter a  description', 2);
            valid = false;
        }else if(description != description.match(/^[a-z-0-9][a-z0-9_\ ./,>]{4,100}$/i)){
			new NotificationHelper.NotificationHelpers().warning('Ouch! Maximum number of characters exceeded', 2);
            valid = false;
        }
        if(className == '' || className == null){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please select a  tag', 2);
            valid = false;
        }
		if(start == '' || start == null || start.length < 0){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please select s  start date', 2);
            valid = false;
        }
		if(end == '' || end == null || end.length < 0){
            new NotificationHelper.NotificationHelpers().warning('Ouch! Please select s  end date', 2);
            valid = false;
        }
        if(valid){
			$http.post('http://localhost:3000/updateEvents', {params: {id: id, title: new SanitizeHelper.SanitizeHelpers().charScape(title), description: new SanitizeHelper.SanitizeHelpers().charScape(description), start: start, end: end, className: className}}).then(function (httpResponse) {
                if (httpResponse.data.status === 200) {
                    $('#calendar').fullCalendar("refetchEvents");
                    new NotificationHelper.NotificationHelpers().success('Congrats! Your Event Was Updated Successfully!', 2);
                    angular.element('#edit-modal').modal('hide');
                }else{
                    new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
                }
            });            
        }        
    }
           
    $('#calendar').fullCalendar({          
                header: {
                    left: 'today',
                    center: 'prev title next',
                    right: 'month,basicWeek,basicDay'                
                },
                titleRangeSeparator: "-", 
                buttonText: {
                prev: "" ,
                next: "",
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day'
                },
                views: {
                    week: {
                        titleFormat: 'MMM D'
                    }
                },
                defaultDate: moment(),
                editable: true,
                eventLimit: true, 
                selectable: true,
                selectHelper: true,
                events: {
                    url: 'http://localhost:3000/getEvents',
                    type: 'GET',
                    error: function(err) {
						console.log('Error!- This request could not be completed' + err);
                    },
                    success: function(response) {
                        $scope.drawerEvents = response;
                        $scope.$apply();
                    },
                },
                select: function(start, end) {
                    $scope.start = moment(start).format('YYYY-MM-DD');
                    $scope.end = moment(end).format('YYYY-MM-DD');
                    angular.element('#new-modal').modal('show');
                    $scope.$apply();
                    $('#calendar').fullCalendar('unselect');
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
		   let i = document.createElement('i');
		   i.className = 'fa fa-check';
		   i.classList.add(event.icon);
		   element.find('div.fc-content').prepend(i);	
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
	
	$http.get('http://localhost:3000/getMailconfig').then(function successCallback(response) {
		if(response.data.length > 0){
			$.each(response.data, function(key, val){
				$scope.username = new SanitizeHelper.SanitizeHelpers().decrypt(val.mail_username);
				$scope.password = new SanitizeHelper.SanitizeHelpers().decrypt(val.mail_password);
			 });
			$scope.editBtn = true;
		}else{
			$scope.newBtn = true;
		}

	}, function errorCallback(response) {
		console.log(response);
	});
	$scope.editConfig = function (){
		let username = new SanitizeHelper.SanitizeHelpers().encrypt($scope.username);
		let password = new SanitizeHelper.SanitizeHelpers().encrypt($scope.password);
		
		$http.put('http://localhost:3000/updateMailconfig', {params: {username: username, password: password}}).then(function (httpResponse) {
			if (httpResponse.data.status === 200) {
				new NotificationHelper.NotificationHelpers().success('Congrats! Your Settings Was Updated Successfully!', 2);
				angular.element('#about-modal').modal('hide');
			}else{
				new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
			}
		});
	}
	
	$scope.addConfig = function (){
		let username = new SanitizeHelper.SanitizeHelpers().encrypt($scope.username);
		let password = new SanitizeHelper.SanitizeHelpers().encrypt($scope.password);
		
		$http.post('http://localhost:3000/addMailconfig', {params: {username: username, password: password}}).then(function (httpResponse) {
			if (httpResponse.data.status === 200) {
				new NotificationHelper.NotificationHelpers().success('Congrats! Your Settings Was Configured Successfully!', 2);
				angular.element('#about-modal').modal('hide');
			}else{
				new NotificationHelper.NotificationHelpers().error('Something went wrong when trying to create your event', 2);
			}
		});
	}
});
