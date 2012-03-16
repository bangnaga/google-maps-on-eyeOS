<?php
    Abstract class googlemapsApplication extends EyeosApplicationExecutable{
        public static function __run(AppExecutionContext $context, MMapResponse $response){
            //$script = '<head><script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true&region=CN&language=zh-CN"></script></head>';
            //$response->appendToBody($script);
            //eyeX('loadScript',array('url' => 'index.php?extern=apps/googlemaps/js/googlemaps'.EYE_CODE_EXTENSION.'&type=dynamic&params[]='.$directory.'&params[]='.$size.'&params[]='.$command)); 
            $buffer = '';
            $buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/googlemaps/classes/googlemapsapi.js');
            $response->appendToBody($buffer);
        }
    }
?>
