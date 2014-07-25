bootstrap-imgupload
===================

Small jquery plugin for uploading images in base_64

*************************************

Just pass the values through data-loadtarget and data-path

<a href="#" class="btn-round pull-right btn-blue  img-upload" data-loadtarget='where_will_the_img_load' data-max='0' data-path="reciever" >+</a>

And initialize it like 

$('.img-upload').imgUpload({
	error_label: 'labelforerror'
})

*******************************
PHP RECIEVER

public function previewImg(){
		$file_temp = '_'.md5(date('YmdHis').rand(1,9999999)).'.jpg';
		$file_temp_name = 'ORIGINAL' . $file_temp;
		$file_target =  $_SERVER['DOCUMENT_ROOT']. '/uploads/'.$file_temp;
		$ifp = fopen($file_target, "wb"); 
		$data = explode(',', $_POST['img']);
		fwrite($ifp, base64_decode($data[1])); 
    	fclose($ifp); 
    	echo json_encode(array('img'=>array($file_temp)));
		
}