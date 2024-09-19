"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../input/InputField";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import GlobalApi from "@/lib/GlobalApi";
import { useToast } from "@/components/ui/use-toast";

const Form = ({ closeDialog }) => {
	const { toast } = useToast();
	const { user } = useKindeBrowserClient();
	const [userData, setUserData] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	useEffect(() => {
		if (!user?.email) return;

		const fetchData = async () => {
			try {
				const userResponse = await GlobalApi.getDesigner();
				const matchedUser = userResponse.data.data.find(
					(u) => u.attributes.email === user.email
				);
				if (matchedUser) {
					setUserData(matchedUser);
				}
			} catch (error) {
				toast({
					title: "Error 😢",
					description: "Could not fetch user data. Please try again later.",
					variant: "destructive"
				});
			}
		};

		fetchData();
	}, [user, toast]);

	const checkIfCompanyExistsForUser = async (userId, companyName) => {
		try {
			const companies = await GlobalApi.getCompaniesByUserId(userId);
			const companyData = companies.data;

			// Verificar si alguna de las compañías tiene el mismo nombre
			return companyData.some(
				(company) =>
					company.attributes.Name.toLowerCase() === companyName.toLowerCase()
			);
		} catch (error) {
			toast({
				title: "Error 😢",
				description:
					"Could not verify if the company exists. Please try again later.",
				variant: "destructive"
			});

			return false;
		}
	};

	const onSubmit = async (info) => {
		if (!userData) {
			toast({
				title: "Error 😢",
				description: "User data not available. Please try again later.",
				variant: "destructive"
			});
			return;
		}

		const userId = userData.id;
		try {
			const companyExists = await checkIfCompanyExistsForUser(
				userId,
				info.companyName
			);
			if (companyExists) {
				toast({
					title: "Error 😢",
					description:
						"Company already exists, please try again with a different name.",
					variant: "destructive"
				});
				return;
			} else {
				const data = {
					data: {
						Name: info.companyName,
						Industry: info.industry,
						Email: info.email,
						country: info.country,
						user_name: userId // Asociar la compañía con el usuario
					}
				};

				const response = await GlobalApi.postNewCompany(data);
				if (response.status === 200) {
					toast({
						title: "Well done 🎉",
						description: "Company registered successfully!"
					});

					closeDialog();
				}
			}
		} catch (error) {
			toast({
				title: "Error 😢",
				description:
					"Could not verify if the company exists. Please try again later.",
				variant: "destructive"
			});
		}
	};

	const industryOptions = [
		{ value: "IT>Design", label: "IT > Design" },
		{ value: "IT>Development", label: "IT > Development" },
		{ value: "IT>QA", label: "IT > QA" },
		{ value: "IT>Support", label: "IT > Support" },
		{ value: "Finance>Banking", label: "Finance > Banking" },
		{ value: "Finance>Investment", label: "Finance > Investment" },
		{ value: "Finance>Insurance", label: "Finance > Insurance" },
		{ value: "Healthcare>Hospitals", label: "Healthcare > Hospitals" },
		{
			value: "Healthcare>Pharmaceuticals",
			label: "Healthcare > Pharmaceuticals"
		},
		{ value: "Healthcare>HealthTech", label: "Healthcare > HealthTech" },
		{ value: "Education>Schools", label: "Education > Schools" },
		{ value: "Education>Universities", label: "Education > Universities" },
		{ value: "Education>EdTech", label: "Education > EdTech" },
		{ value: "Retail>E-commerce", label: "Retail > E-commerce" },
		{ value: "Retail>Physical Stores", label: "Retail > Physical Stores" },
		{ value: "Retail>Wholesale", label: "Retail > Wholesale" },
		{ value: "Manufacturing>Automotive", label: "Manufacturing > Automotive" },
		{
			value: "Manufacturing>Electronics",
			label: "Manufacturing > Electronics"
		},
		{ value: "Manufacturing>Textiles", label: "Manufacturing > Textiles" }
	];

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<Input
				id="companyName"
				label="Company Name"
				placeholder="Enter company name"
				register={register}
				errors={errors}
				type="text"
			/>
			<Input
				type="select"
				label="Choose Industry"
				id="industry"
				register={register}
				errors={errors}
				options={industryOptions}
			/>
			<Input
				id="email"
				label="Email"
				type="email"
				placeholder="Enter email address"
				register={register}
				errors={errors}
			/>
			<Input
				id="country"
				label="Country"
				placeholder="Enter country"
				register={register}
				errors={errors}
				type="text"
			/>
			<Button type="submit" className="w-full" size="lg">
				Register Company
			</Button>
		</form>
	);
};

export default Form;
