<!-- START CONTENT -->
<div id="leadscont" class="">

  <!-- Start Page Header -->
  <div class="page-header">
    <h1 class="title">Counter Measure Types</h1>
    <!-- Start Page Header Right Div -->
    <div class="right">
      <div class="btn-group" role="group" aria-label="...">
        <a href="#sensors" class="btn btn-light" style="font-weight:600"><i class="fa fa-users"></i>All Counter Measures</a>
        <a href="#start" class="btn btn-light"><i class="fa fa-remove"></i></a>
      </div>
    </div>
    <!-- End Page Header Right Div -->
  </div>
  <!-- End Page Header -->

 <!-- //////////////////////////////////////////////////////////////////////////// --> 
  <!-- START CONTAINER -->
  <div class="container-padding">
    <!-- Start Row -->
    <div class="row">
      <div class="col-xs-12 col-sm-6">
        <div class="panel panel-default">

          <div class="panel-title">
            New Counter Measure Type
            <ul class="panel-tools">
              <li><a class="icon minimise-tool"><i class="fa fa-minus"></i></a></li>
              <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
              <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
            </ul>
          </div>

          <div class="panel-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Name:<span class="color10">*</span></label>
                <div class="col-sm-10">
                  <input type="text" name="name" class="form-control">
                </div>
              </div>
                  
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Type:</label>
                <div class="col-sm-10">
                  <select class="selectpicker form-control" id="type" name="type" data-live-search="true">
                    <option data-icon="fa fa-user" value="">Select Type...</option>
                    <option data-icon="fa fa-user" value="Electro-Mechanical">Electro-Mechanical Actuator</option>
                    <option data-icon="fa fa-user" value="Human-Computer">Human-Computer Agent</option>
                  </select>  
                </div>              
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Category:</label>
                <div class="col-sm-10">
                  <select class="selectpicker form-control" id="category" name="category" data-live-search="true">
                    <option data-icon="fa fa-user" value="">Select Category...</option>
                    <option data-icon="fa fa-user" value="Deterrence">Deterrence</option>
                    <option data-icon="fa fa-user" value="Defense">Defense</option>
                    <option data-icon="fa fa-user" value="Offense">Offense</option>
                  </select>  
                </div>              
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Description:</label>
                <div class="col-sm-10">
                  <textarea class="form-control" name="description" rows="5"></textarea>
                </div>
              </div>
              <button type="submit" class="btn btn-default nsave">Save</button>
              <button type="submit" class="btn btn-warning ncancel">Cancel</button>
            </form>

          </div>

        </div>
      </div>
      <div class="col-xs-12 col-sm-6">
        <div class="panel panel-default">

          <div class="panel-title">
            Modify Counter Measure Type
            <ul class="panel-tools">
              <li><a class="icon minimise-tool"><i class="fa fa-minus"></i></a></li>
              <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
              <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
            </ul>
          </div>

          <div class="panel-body" id='eform'>
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Search:</label>
                <div class="col-sm-10">
                  <select class="selectpicker form-control" id="locations" name="locations" data-live-search="true">
                    <option data-icon="fa fa-user">Select Sensor Type ...</option>
                    <option data-icon="fa fa-user">Alex Mbaka</option>
                    <option data-icon="fa fa-user">Prince Munene</option>
                  </select>  
                </div>              
              </div>    
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Name:<span class="color10">*</span></label>
                <div class="col-sm-10">
                  <input type="text" name="name2" class="form-control" id="ename">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Type:</label>
                <div class="col-sm-10">
                  <select class="selectpicker form-control" id="type" name="type2" id="etype" data-live-search="true">
                    <option data-icon="fa fa-user" value="">Select Type...</option>
                    <option data-icon="fa fa-user" value="Electro-Mechanical">Electro-Mechanical Actuator</option>
                    <option data-icon="fa fa-user" value="Human-Computer">Human-Computer Agent</option>
                  </select>  
                </div>              
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Category:</label>
                <div class="col-sm-10">
                  <select class="selectpicker form-control" id="ecategory" name="category2" data-live-search="true">
                    <option data-icon="fa fa-user" value="">Select Category...</option>
                    <option data-icon="fa fa-user" value="Deterrence">Deterrence</option>
                    <option data-icon="fa fa-user" value="Defense">Defense</option>
                    <option data-icon="fa fa-user" value="Offense">Offense</option>
                  </select>  
                </div>              
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">Description:</label>
                <div class="col-sm-10">
                  <textarea class="form-control" name="description2" id="edescription" rows="5"></textarea>
                </div>
              </div>
              <button type="submit" class="btn btn-default esave">Save</button>
              <button type="submit" class="btn btn-warning edelete">Delete</button>
            </form>

          </div>

        </div>
      </div>
    </div>
    <!-- End Row -->
  </div>
</div>

