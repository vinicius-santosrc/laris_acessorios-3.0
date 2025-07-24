/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { useEffect, useState } from "react";
import { Categorys } from "../../../lib/utils";
import CategoryCard from "../category-card/CategoryCard";
import "./CategoryList.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { FacilitysRepository } from "../../../repositories/facilitys";
import { useFacility } from "../../../contexts/FacilityContext";

const CategoryList = () => {
    const [facilityImages, setFacilityImages] = useState<{ [key: string]: string }>({});
    const { facility } = useFacility();
    const facilityRepo = new FacilitysRepository();

    const getFacilitys = async (photoURL: string) => {
        try {
            if (facility) {
                const facilityItem = facilityRepo.getByRef(photoURL, facility);
                setFacilityImages((prev: any) => ({
                    ...prev,
                    [photoURL]: facilityItem.data,
                }));
            }

        } catch (error: any) {
            throw Error(error);
        }
    };

    useEffect(() => {
        Categorys.forEach((item) => {
            getFacilitys(item.photoURL);
        });
    }, [facility]);

    return (
        <section className="category-list-wrapper">
            <div className="category-list-content">
                <Swiper
                    slidesPerView={6}
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {Categorys.map((item, id) => (
                        <SwiperSlide key={id}>
                            <CategoryCard
                                title={item.title}
                                redirect={item.redirect}
                                photoURL={facilityImages[item.photoURL] || item.photoURL} // Usa a nova imagem ou a original
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="category-list-content-mobile">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    modules={[]}
                    className="mySwiper"
                >
                    {Categorys.map((item, id) => (
                        <SwiperSlide key={id}>
                            <CategoryCard
                                title={item.title}
                                redirect={item.redirect}
                                photoURL={facilityImages[item.photoURL] || item.photoURL} // Mesmo aqui
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategoryList;
