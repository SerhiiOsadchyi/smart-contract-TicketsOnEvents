import {Divider} from "antd";
import {Field as FormikField, Form as FormikForm, Formik} from "formik";
import s from "../Events.module.css";
import {DatePicker} from "formik-antd";
import moment from 'moment';
import React from "react";
import {useDispatch} from "react-redux";
import {addNewEvent} from "../../../redux/events-reducer";
import Web3 from "web3";

const { RangePicker } = DatePicker;

export const NewEvent = ({closeNewEventMode, userAddress}) => {

    const dispatch = useDispatch();
    debugger

    const validatorValue = (errorField, value) => {
        let error;
        if (!value) {
            error = errorField;
        }
        return error;
    }

    const validatorValueAndInteger = (errorField, value) => {
        let error;
        if (!value) {
            error = errorField;
        } else if (!Number.isInteger(value) ) {
            error = 'Please, insert integer';
        }
        return error;
    }

    const validatorValueAndNumber = (errorField, value) => {
        let error;
        if (!value) {
            error = errorField;
        } else if (!Number(value) ) {
            error = 'Please, insert number';
        }
        return error;
    }

    const eventNameValidate = (value) => {
        return validatorValue('Please, add name for this event', value)
    }
    const descriptionValidate = (value) => {
        return validatorValue('Please, fill description of this event', value)
    }
    const locationValidate = (value) => {
        return validatorValue('Please, give me location of this event', value)
    }

    const amountValidate = (value) => {
        return validatorValueAndInteger('Please, give me total supply tickets for this event', value)
    }

    const priceValidate = (value) => {
        return validatorValueAndNumber('Please, insert ticket\'s price', value)
    }

    const rangeDateValidate = (value) => {
        let error;
        if (value.length === 0) {
            error = 'Please, choice start and end dates of this event';
        }
        return error;
    }

    return (
        <>
            <Divider>Add new event</Divider>
            <Formik
                initialValues={{
                    eventName: '', description: '', location: '', image: '', amount: '', price: '', rangeDate: []
                }}

                onSubmit={(values, {setSubmitting},) => {
                    values.startDate = Date.parse(values.rangeDate[0]);
                    values.endDate = Date.parse(values.rangeDate[1]);
                    values.price = Web3.utils.toWei(values.price.toString(), 'ether');
                    dispatch(addNewEvent(values, userAddress));
                    closeNewEventMode();
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 400);

                }}
            >
                {({errors, touched, validateField, validateForm, isSubmitting}) => (
                    <FormikForm>
                        <div className={s.field}>
                            <div>
                                <label htmlFor="eventName">Event name</label>
                            </div>
                            <div>
                                <FormikField name="eventName" placeholder="Event name" validate={eventNameValidate}/>
                                {errors.eventName && touched.eventName &&
                                <div className={s.error}>{errors.eventName}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="description">Event description</label>
                            </div>
                            <div>
                                <FormikField type="textarea" name="description" placeholder="Event description"
                                             component="textarea" validate={descriptionValidate}/>
                                {errors.description && touched.description &&
                                <div className={s.error}>{errors.description}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="location">Event location</label>
                            </div>
                            <div>
                                <FormikField name="location" placeholder="location" validate={locationValidate}/>
                                {errors.location && touched.location &&
                                <div className={s.error}>{errors.location}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="image">URL for image</label>
                            </div>
                            <div>
                                <FormikField type="url" name="image" placeholder="URL for image" />
                                {errors.image && touched.image && <div className={s.error}>{errors.image}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="price">Ticket price, Ether</label>
                            </div>
                            <div>
                                <FormikField type="number" name="price" validate={priceValidate}/>
                                {errors.price && touched.price && <div className={s.error}>{errors.price}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="amount">Tickets amount</label>
                            </div>
                            <div>
                                <FormikField type="number" name="amount" validate={amountValidate}/>
                                {errors.amount && touched.amount && <div className={s.error}>{errors.amount}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="rangeDate">Event's duration</label>
                            </div>
                            <div>
                                <RangePicker name="rangeDate" validate={rangeDateValidate}
                                             showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('09:00:00', 'HH:mm:ss'),
                                                moment('18:59:59', 'HH:mm:ss')],
                                }} />
                                {errors.rangeDate && touched.rangeDate &&
                                <div className={s.error}>{errors.rangeDate}</div>}
                            </div>
                        </div>

                        <div>
                            <button className={`ant-btn ant-btn-primary ${s.submitButton}`} type="submit" disabled={isSubmitting}>Submit
                            </button>
                        </div>
                    </FormikForm>
                )}
            </Formik>
        </>
    )
};