//
//  HHWaterWaveController.m
//
//  Created by HMac on 16/11/7.
//  Copyright (c) 2016年 HMac. All rights reserved.
//

#import "WaterWaveManager.h"
#import "HHWaveProgressView.h"

@interface WaterWaveManager ()

@end

@implementation WaterWaveManager

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (UIView *)view
{
  HHWaveProgressView *waveProgressView = [[HHWaveProgressView alloc]initWithFrame:CGRectMake(0, 0, 180, 180)];
  waveProgressView.numberLabel.text = @"";
  
  [waveProgressView startWave];
  
  return waveProgressView;
}

RCT_EXPORT_VIEW_PROPERTY(percent, CGFloat);

@end
