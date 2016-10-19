define(["app", "tpl!templates/counterMeasures.tpl", "tpl!templates/counterMeasure.tpl", "tpl!templates/counterMeasureType.tpl", "tpl!templates/counterMeasureData.tpl",
   "backbone.syphon"], 
	function(System, counterMeasuresTpl, counterMeasureTpl, counterMeasureTypesTpl, counterMeasureDataTpl, advanceTpl, salaryTpl, payrollTpl, employeeTxTpl){
  System.module('CounterMeasuresApp.Show.View', function(View, System, Backbone, Marionette, $, _){
    
    View.CounterMeasures = Marionette.CompositeView.extend({

      template: counterMeasuresTpl,

      onShow: function(){
        this.setup();
      },

      setup: function(){
          var THAT = this;
          var ext = 'employees';
          if (this.model.get('type') == 'exemployees') {
            ext = 'exemployees';
          }

          var ul = $('tbody');
          ul.empty();
          $.get(System.coreRoot + '/service/hrm/index.php?'+ext, function(result) {
            var m = JSON.parse(result);
            m.forEach(function(elem){
              var tpl = $('<tr><td>'+elem['name']+'</td><td>'+elem['telephone']+'</td><td>'+elem['email']+'</td><td>'+elem['department']+'</td><td>'+elem['position']+'</td>'
                +'<td><p class="xid" style="display: none;">'+elem['id']+'</p><a class="btn btn-small js-edit xcheck" href="#"><i class="fa fa-trash"></i></a></td></tr>');
              tpl.appendTo(ul);
            });

            $('.xcheck').on('click', function(e){
              e.preventDefault();
              e.stopPropagation();
              var id = $(this).parent().find('.xid');
              id = parseInt(id.text());
              swal({
                title: "Are you sure?",
                text: "You will not be able to recover this record!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
              },
              function(isConfirm){
                if (isConfirm) {
                  THAT.deleteRecord(id);               
                } else {
                  swal("Cancelled", "Your record is safe :)", "error");
                }
              });
              
            });
            
          });
        },

        deleteRecord: function(id) {
          this.trigger("del", id);
        },

        onDelete: function(e) { 
          swal("Deleted!", "Your record has been deleted.", "success");
          this.setup();
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        },

        onError: function(e) { 
          swal("Error!", "Transaction failed! Try again later.", "error");
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        }
    });

    View.CounterMeasureTypes = Marionette.ItemView.extend({

        template: counterMeasureTypesTpl,

        events: {
          "click .nsave": "addEmployee",
          "click .esave": "editEmployee",
          "click .edelete": "deleteEmployee",
          "change .selectpicker": "getEmployee"
        },

        onShow: function(){
          //$("#leadscont").unwrap();
          require(["sweetalert"], function(){
              require.undef('sweetalert');
              require(["sweetalert"], function(){});
          });
         
          this.setup();
        },

        setup: function(){
          var ul = $('#employees');
          ul.empty();
          $.get(System.coreRoot + '/service/hrm/index.php?employees', function(result) {
            var m = JSON.parse(result);
            var tp = $('<option data-icon="fa fa-user">Select Employee...</option>');
            tp.appendTo(ul);
            
            m.forEach(function(elem){
              var tpl = $('<option data-icon="fa fa-user" value="'+elem['id']+'">'+elem['name']+'</option>');
              tpl.appendTo(ul);
            });
            setTimeout(function() {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
            }, 300);
          });
        },

        addEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          var data = Backbone.Syphon.serialize(this);
          //alert(JSON.stringify(data));
          //swal("Success!", "The record has been created.", "success");
          this.trigger("create", data);
        },

        editEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          var data = {};
          data['id'] = parseInt($('#employees').find("option:selected").val());
          data['name'] = $('#ename').val();
          data['tel'] = $('#etel').val();
          data['email'] = $('#eemail').val();
          data['address'] = $('#eadd').val();
          data['gender'] = $('#egender').val();
          data['department'] = $('#edept').val();
          data['position'] = $('#epos').val();
          data['salary'] = $('#esalary').val();
          //alert(JSON.stringify(data));
          //swal("Success!", "The record has been created.", "success");
          this.trigger("edit", data);
        },

        deleteEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          var data = {};
          data['id'] = parseInt($('#employees').find("option:selected").val());
          data['operation'] = 'deleteEmployee';
          var THAT = this;
          swal({
                title: "Are you sure?",
                text: "You will not be able to recover this record!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
              },
              function(isConfirm){
                if (isConfirm) {
                  //THAT.trigger("delete", data);

                  $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
                    if (result == 1) {
                      swal("Deleted!", "Your record has been deleted.", "success"); 
                      $('input').val('');
                      $('textarea').val('');
                      THAT.setup();
                    }else{
                      swal("Error!", "Transaction failed! Try again later.", "error");
                    }
                  });
                  
                             
                } else {
                  swal("Cancelled", "Your record is safe :)", "error");
                }
              });
          
        },

        getEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          
          var id = parseInt($('#employees').find("option:selected").val());
          $.get(System.coreRoot + '/service/hrm/index.php?employee&empid='+id, function(result) {
            var m = JSON.parse(result);
            $('#ename').val(m['name']);
            $('#etel').val(m['telephone']);
            $('#eemail').val(m['email']);
            $('#eadd').val(m['address']);
            $('#edept').val(m['department']);
            $('#epos').val(m['position']);
            $('#egender option[value="'+m['gender']+'"]').prop('selected', true);
            $('select[name=gender2]').val(m['gender']);
            $('#esalary').val(m['salary']['amount']);

            setTimeout(function() {
              $('.selectpicker').selectpicker('refresh');
            }, 150);

          });
          //swal("Success!", "The record has been created.", "success");
          //this.trigger("delete", data);
        },

        onDelete: function(e) { 
          swal("Deleted!", "Your record has been deleted.", "success");
          $('input').val('');
          $('textarea').val('');
          this.setup();
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        },

        onSuccess: function(e) { 
          swal("Success!", "The record has been saved.", "success");
          $('input').val('');
          $('textarea').val('');
          this.setup();
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        },

        onError: function(e) { 
          swal("Error!", "Transaction failed! Try again later.", "error");
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        }
    });

    View.CounterMeasure = Marionette.ItemView.extend({

        template: counterMeasureTpl,

        events: {
          "click .nsave": "addEmployee",
          "click .esave": "editEmployee",
          "click .edelete": "deleteEmployee",
          "change .selectpicker": "getEmployee"
        },

        onShow: function(){
          //$("#leadscont").unwrap();
          require(["sweetalert"], function(){
              require.undef('sweetalert');
              require(["sweetalert"], function(){});
          });
         
          this.setup();
        },

        setup: function(){
          var ul = $('#employees');
          ul.empty();
          $.get(System.coreRoot + '/service/hrm/index.php?employees', function(result) {
            var m = JSON.parse(result);
            var tp = $('<option data-icon="fa fa-user">Select Employee...</option>');
            tp.appendTo(ul);
            
            m.forEach(function(elem){
              var tpl = $('<option data-icon="fa fa-user" value="'+elem['id']+'">'+elem['name']+'</option>');
              tpl.appendTo(ul);
            });
            setTimeout(function() {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
            }, 300);
          });
        },

        addEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          var data = Backbone.Syphon.serialize(this);
          //alert(JSON.stringify(data));
          //swal("Success!", "The record has been created.", "success");
          this.trigger("create", data);
        },

        editEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          var data = {};
          data['id'] = parseInt($('#employees').find("option:selected").val());
          data['name'] = $('#ename').val();
          data['tel'] = $('#etel').val();
          data['email'] = $('#eemail').val();
          data['address'] = $('#eadd').val();
          data['gender'] = $('#egender').val();
          data['department'] = $('#edept').val();
          data['position'] = $('#epos').val();
          data['salary'] = $('#esalary').val();
          //alert(JSON.stringify(data));
          //swal("Success!", "The record has been created.", "success");
          this.trigger("edit", data);
        },

        deleteEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          var data = {};
          data['id'] = parseInt($('#employees').find("option:selected").val());
          data['operation'] = 'deleteEmployee';
          var THAT = this;
          swal({
                title: "Are you sure?",
                text: "You will not be able to recover this record!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
              },
              function(isConfirm){
                if (isConfirm) {
                  //THAT.trigger("delete", data);

                  $.post(System.coreRoot + '/service/hrm/index.php', data, function(result) {
                    if (result == 1) {
                      swal("Deleted!", "Your record has been deleted.", "success"); 
                      $('input').val('');
                      $('textarea').val('');
                      THAT.setup();
                    }else{
                      swal("Error!", "Transaction failed! Try again later.", "error");
                    }
                  });
                  
                             
                } else {
                  swal("Cancelled", "Your record is safe :)", "error");
                }
              });
          
        },

        getEmployee: function(e) { 
          e.preventDefault();
          e.stopPropagation();
          
          var id = parseInt($('#employees').find("option:selected").val());
          $.get(System.coreRoot + '/service/hrm/index.php?employee&empid='+id, function(result) {
            var m = JSON.parse(result);
            $('#ename').val(m['name']);
            $('#etel').val(m['telephone']);
            $('#eemail').val(m['email']);
            $('#eadd').val(m['address']);
            $('#edept').val(m['department']);
            $('#epos').val(m['position']);
            $('#egender option[value="'+m['gender']+'"]').prop('selected', true);
            $('select[name=gender2]').val(m['gender']);
            $('#esalary').val(m['salary']['amount']);

            setTimeout(function() {
              $('.selectpicker').selectpicker('refresh');
            }, 150);

          });
          //swal("Success!", "The record has been created.", "success");
          //this.trigger("delete", data);
        },

        onDelete: function(e) { 
          swal("Deleted!", "Your record has been deleted.", "success");
          $('input').val('');
          $('textarea').val('');
          this.setup();
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        },

        onSuccess: function(e) { 
          swal("Success!", "The record has been saved.", "success");
          $('input').val('');
          $('textarea').val('');
          this.setup();
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        },

        onError: function(e) { 
          swal("Error!", "Transaction failed! Try again later.", "error");
          //alert(JSON.stringify(data));
          //this.trigger("create", data);
        }
    });

    View.CounterMeasureData = Marionette.ItemView.extend({

        template: counterMeasureDataTpl,

        events: {
          "click .ediscard": "setup",
          "click .esubmit": "postAllowance"
        },

        onShow: function(){                  
          $('.loading').hide();
          this.setup();
        },

        setup: function(){          
          var ul = $('#employees');
          ul.empty();
          var ulc = $('#expenses');
          ulc.empty();

          $.get(System.coreRoot + '/service/hrm/index.php?employees', function(result) {
            var m = JSON.parse(result);
            var tp = $('<option data-icon="fa fa-user">Select Employee...</option>');
            tp.appendTo(ul);
            
            m.forEach(function(elem){
              var tpl = $('<option data-icon="fa fa-user" value="'+elem['id']+'">'+elem['name']+'</option>');
              tpl.appendTo(ul);
            });
            
            setTimeout(function() {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
            }, 300);
          });

          $.get(System.coreRoot + '/service/finance/index.php?ledgerType="Expense"', function(result) {
            var m = JSON.parse(result);
            var tp = $('<option data-icon="fa fa-money">Select Ledger...</option>');
            tp.appendTo(ulc);
            
            m.forEach(function(elem){
              var tpl = $('<option data-icon="fa fa-money" value="'+elem['id']+'">'+elem['name']+'</option>');
              tpl.appendTo(ulc);
            });
            
            setTimeout(function() {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
            }, 300);
            
          });  
          $('button').prop({disabled: false});
          $('form input, form textarea').val('');
          $('#date-picker').daterangepicker({ singleDatePicker: true, format: 'DD/MM/YYYY', maxDate: moment().format('DD/MM/YYYY') }, function(start, end, label) {});
        },

        postAllowance: function(e) { 
          $('button').prop({disabled: true});
          e.preventDefault();
          e.stopPropagation();
          var data = Backbone.Syphon.serialize(this);
          
          data['id'] = parseInt(data['id'], 10);
          data['ledger'] = parseInt(data['ledger'], 10);
          
          if (data['id'] && data['date'] && data['ledger'] && data['amount'] != 0 && data['descr'] != "") {
              //alert(JSON.stringify(data));
              this.trigger("post", data);
          }else{
              swal("Missing Information!", "Ensure all fields are filled!", "info");
              $('button').prop({disabled: false});
          }
        },

        onSuccess: function(voucher) {
          swal("Success!", "The employee allowance has been posted.", "success");
          //window.open("report.php?id=2&voucher=" + voucher);
          var rform = document.createElement("form");
          rform.target = "_blank";
          rform.method = "POST"; // or "post" if appropriate
          rform.action = "empvoucher.php";

          voucher['user'] = System.username;
          var vouch = document.createElement("input");
          vouch.name = "voucher";
          vouch.value = JSON.stringify(voucher);
          rform.appendChild(vouch);

          document.body.appendChild(rform);

          rform.submit();

          rform.parentNode.removeChild(rform);          
          this.setup();
        },

        onError: function(e) { 
          swal("Error!", "Transaction failed! Try again later.", "error");   
          $('button').prop({disabled: false});       
        }
    });

  });

  return System.CounterMeasuresApp.Show.View;
});