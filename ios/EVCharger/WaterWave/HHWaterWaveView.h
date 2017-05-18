//
//  HHWaterWaveView.h
//
//  Created by HMac on 16/11/7.
//  Copyright (c) 2016年 HMac. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface HHWaterWaveView : UIView

@property (nonatomic, strong)   UIColor *firstWaveColor;    // 第一个波浪颜色
@property (nonatomic, strong)   UIColor *secondWaveColor;   // 第二个波浪颜色

@property (nonatomic, assign)   CGFloat percent;            // 百分比

-(void) startWave;

-(void) stopWave;

-(void) reset;

@end
