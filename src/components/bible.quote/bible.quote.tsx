'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import './bible.quote.css';
import Quote from '../quote/quote';
import { Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Verse from '../verse/verse';

export default function BibleQuote() {
	const pagination = {
		clickable: true,
		renderBullet: function (index: any, className: any) {
			var bullet;
			if (index == 0) {
				bullet = 'Bible Verse';
			} else if (index == 1) {
				bullet = 'Quote';
			}
			return '<span class="' + className + '">' + bullet + '</span>';
		},
	};
	return (
		<div className="container">
			<Swiper
				pagination={pagination}
				modules={[Pagination]}
				className="mySwiper"
			>
				<SwiperSlide>
					<Verse />
				</SwiperSlide>
				<SwiperSlide>
					<Quote />
				</SwiperSlide>
			</Swiper>
		</div>
	);
}
