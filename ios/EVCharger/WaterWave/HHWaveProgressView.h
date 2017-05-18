//
//  HHWaveProgressView.h
//
//  Created by HMac on 16/11/7.
//  Copyright (c) 2016年 HMac. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface HHWaveProgressView : UIView

@property (nonatomic, weak,readonly) UIImageView *backgroundImageView; // 背景图片

@property (nonatomic, weak,readonly) UILabel *numberLabel;  // 数字

@property (nonatomic, weak,readonly) UILabel *unitLabel;    // 单位符号 ,可以没有

@property (nonatomic, weak,readonly) UILabel *explainLabel; // 单位名称 （分，正确率）

@property (nonatomic,assign) CGFloat percent; // 0~1

@property (nonatomic, assign) UIEdgeInsets  waveViewMargin;

- (void)startWave;

- (void)stopWave;

- (void)resetWave;

@end
