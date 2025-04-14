---
title: Mac에서 OpenCV 설치 및 예제 구동하기
author: haruair
uuid: "f050bcd0-8a7a-4503-9324-6b2ef6805da8"
type: post
date: "2014-05-06T05:58:49"
history:
  - 
    from: https://www.haruair.com/blog/2177
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: installing-opencv-on-mac-and-running-examples
tags:
  - 개발 이야기
  - opencv

---
주말에 아티클을 보다가 관심이 생겨 OpenCV를 잠깐 살펴봤다. [OpenCV][1]는 Computer Vision 오픈소스 라이브러리로, 제공하는 예제를 통해 Face Tracking 등을 구현해볼 수 있다. 초보자를 위한 튜토리얼은 많은데 생각처럼 잘 안되는 부분들이 있어 이 글을 작성했다. 이 글에서는 `Mac OSX`, `xcode`를 사용했다.

OpenCV는 brew를 통해서도 설치할 수 있는데, 내가 놓치고 있는 부분이 있는지 잘 안되서 리포지터리에서 받아 컴파일했다.

먼저 컴파일을 위해 `cmake`를 brew로 설치한다.

    $ brew install cmake
    

리포지터리를 복제한 후 build, install까지 진행한다.

    $ git clone https://github.com/Itseez/opencv.git && cd opencv
    $ mkdir build
    $ cd build
    $ cmake -G "Unix Makefiles" ..
    $ make -j8
    $ sudo make install
    

이렇게 설치는 완료된다. `/usr/local/lib`에 설치된 `libopencv-*.dylib`를 확인할 수 있다.

## 예제 구동 과정

예제 코드를 그대로 실행하면 바로 되어야 하는데, 리포지터리에 올라가 있는 예제 프로젝트는 xcode 버전 문제로 열리지 않았다. 다음과 같은 과정으로 예제 코드를 확인할 수 있다.

  1. XCode를 실행해 Command Line Tool 프로젝트 생성
  2. Project Navigator에서 우클릭, &#8220;Add File To&#8230;&#8221; 클릭
  3. 파일 선택창이 뜨면 &#8220;/&#8221;를 입력해 네비게이션 패널을 불러와 /usr/local/lib을 입력
  4. `libopencv_<어쩌고>.dylib` 을 모두 선택. (아래 예제에서는 `core`, `highgui`, `imgproc`, `objdetect`만 있어도 구동 가능.)
  5. 프로젝트 파일을 눌러 **Build Settings**에서 &#8220;Header Search Paths&#8221;에 `/usr/local/include`, &#8220;Library Search Paths&#8221;에 `/usr/local/lib`을 추가.
  6. [예전 버전의 cascade][2]를 내려받음
  7. 프로젝트 파일을 눌러 **Build Phases > Copy Files**에 위에서 받은 xml 파일을 추가하고 &#8220;Destination&#8221;을 `Products Directory`로 설정

위 과정을 끝내고 나면 `main.cpp`를 열어 코드를 다음과 같이 작성한다. 이 코드는 opencv 리포지터리에 있는 [MacOSX 예제 코드][3]다.

    #include <CoreFoundation/CoreFoundation.h>
    #include <cassert>
    
    // Example showing how to read and write images
    #include <opencv2/opencv.hpp>
    #include <opencv2/highgui/highgui.hpp>
    
    const char  * WINDOW_NAME  = "Face Tracker";
    const CFIndex CASCADE_NAME_LEN = 2048;
    char    CASCADE_NAME[CASCADE_NAME_LEN] = "~/haarcascade_frontalface_alt2.xml";
    
    using namespace std;
    
    int main(int argc, char** argv)
    {
    
        const int scale = 2;
    
        // locate haar cascade from inside application bundle
        // (this is the mac way to package application resources)
        CFBundleRef mainBundle  = CFBundleGetMainBundle ();
        assert (mainBundle);
        CFURLRef    cascade_url = CFBundleCopyResourceURL (mainBundle, CFSTR("haarcascade_frontalface_alt2"), CFSTR("xml"), NULL);
        assert (cascade_url);
        Boolean     got_it      = CFURLGetFileSystemRepresentation (cascade_url, true,
                                                                    reinterpret_cast<UInt8 *>(CASCADE_NAME), CASCADE_NAME_LEN);
    
        if (! got_it)
            abort ();
    
        // create all necessary instances
        cvNamedWindow (WINDOW_NAME, CV_WINDOW_AUTOSIZE);
        CvCapture * camera = cvCreateCameraCapture (CV_CAP_ANY);
        CvHaarClassifierCascade* cascade = (CvHaarClassifierCascade*) cvLoad (CASCADE_NAME, NULL, NULL, NULL);
        CvMemStorage* storage = cvCreateMemStorage(0);
        assert (storage);
    
        // you do own an iSight, don't you ?!?
        if (! camera)
            abort ();
    
       // did we load the cascade?!?
        if (! cascade)
            abort ();
    
        // get an initial frame and duplicate it for later work
        IplImage *  current_frame = cvQueryFrame (camera);
        IplImage *  draw_image    = cvCreateImage(cvSize (current_frame->width, current_frame->height), IPL_DEPTH_8U, 3);
        IplImage *  gray_image    = cvCreateImage(cvSize (current_frame->width, current_frame->height), IPL_DEPTH_8U, 1);
        IplImage *  small_image   = cvCreateImage(cvSize (current_frame->width / scale, current_frame->height / scale), IPL_DEPTH_8U, 1);
        assert (current_frame && gray_image && draw_image);
    
        // as long as there are images ...
        while ((current_frame = cvQueryFrame (camera)))
        {
            // convert to gray and downsize
            cvCvtColor (current_frame, gray_image, CV_BGR2GRAY);
            cvResize (gray_image, small_image, CV_INTER_LINEAR);
    
            // detect faces
            CvSeq* faces = cvHaarDetectObjects (small_image, cascade, storage,
                                                1.1, 2, CV_HAAR_DO_CANNY_PRUNING,
                                                cvSize (30, 30));
    
            // draw faces
            cvFlip (current_frame, draw_image, 1);
            for (int i = 0; i < (faces ? faces->total : 0); i++)
            {
                CvRect* r = (CvRect*) cvGetSeqElem (faces, i);
                CvPoint center;
                int radius;
                center.x = cvRound((small_image->width - r->width*0.5 - r->x) *scale);
                center.y = cvRound((r->y + r->height*0.5)*scale);
                radius = cvRound((r->width + r->height)*0.25*scale);
                cvCircle (draw_image, center, radius, CV_RGB(0,255,0), 3, 8, 0 );
            }
    
            // just show the image
            cvShowImage (WINDOW_NAME, draw_image);
    
            // wait a tenth of a second for keypress and window drawing
            int key = cvWaitKey (100);
            if (key == 'q' || key == 'Q')
                break;
        }
    
        // be nice and return no error
        return 0;
    }
    

코드를 빌드 및 실행하면 앱이 실행되어 얼굴의 위치를 트래킹하는 모습을 확인할 수 있다. (신기해!)

## 트러블 슈팅

  * `CASCADE_NAME`은 `~`로 시작하지만 컴파일된 파일을 기준으로 하는 상대 경로.
  * `cvLoad()`에 에러가 생길 땐 xml 경로, 파일명 문제, 디버깅용 라이브러리를 넣었을 때 등의 문제라고. 내 경우에는 최신 버전의 xml이라서 에러가 났다. 위 과정처럼 구버전의 xml을 쓰면 구동은 되지만 별로 내키지 않는 해결 방법. (코드는 개선되었는데 예제는 예전 방식으로 되어 있다거나 한 것 같다.)

 [1]: http://opencv.org/
 [2]: https://raw.githubusercontent.com/Itseez/opencv/127d6649a1c83397bf42799ac807af41aa507b30/data/haarcascades/haarcascade_frontalface_alt2.xml
 [3]: https://github.com/Itseez/opencv/tree/master/samples/MacOSX/FaceTracker