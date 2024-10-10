import { describe, it, expect, jest } from '@jest/globals';
import Person from '../src/person';

describe('#Person Suite', () => {
    describe('#validate', () => {
        it('should throw error when name is empty', () => {
            const mockInvalidPerson = {
                name: '',
                cpf: '123.456.789-00'
            }
            expect(() => Person.validate(mockInvalidPerson))
                .toThrow(new Error('name is required'));
        });

        it('should throw error when cpf is empty', () => {
            const mockInvalidPerson = {
                name: 'Xuxa da Silva',
                cpf: ''
            }
            expect(() => Person.validate(mockInvalidPerson))
                .toThrow(new Error('cpf is required'));
        });

        it('should create a valid person', () => {
            const mockValidPerson = {
                name: 'Xuxa da Silva',
                cpf: '123.456.789-00'
            }
            
            // console.log(JSON.stringify(mockValidPerson))
            const result = JSON.stringify(mockValidPerson)
            expect(result).toBe(JSON.stringify(mockValidPerson));
        });
    })

    describe('#format', () => {
        it('should return a formatted person', () => {
            const mockPerson = {
                name: 'Xuxa da Silva',
                cpf: '123.456.789-00'
            }
            const result = Person.format(mockPerson)
            expect(result).toStrictEqual({
                cpf: '12345678900',
                name: 'Xuxa',
                lastName: 'da Silva'
            });
        });
    })

    describe('#save', () => {
        it('should throw error when has invalid properties', () => {
            const mockPerson = {
                cpf: '099.123.456-97',
                name: 'ite'
            }
            expect(() => Person.save(mockPerson))
                .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(mockPerson)}`))
        })

         it('should save a valid person', () => {
            const mockPerson = {
                cpf: '099.123.456-97',
                name: 'ite',
                lastName: 'dos Santos'
            }
             expect(() => Person.save(mockPerson))
                 .not
                 .toThrow()
        })
    })

    describe('#process', () => {
        it('should process a valid person', () => {
            const mockPerson = {
                cpf: '099.123.456-97',
                name: 'Zezin da Silva'
            }
            jest
                .spyOn(
                    Person,
                    Person.validate.name
                )
                .mockReturnValue()
            
            jest
                .spyOn(
                    Person,
                    Person.format.name
                ).mockReturnValue({
                    cpf: '099.123.456-97',
                    name: 'Zezin',
                    lastName: 'da Silva'
                })
            
            const result = Person.process(mockPerson)
            expect(result).toBe('ok')
        })
    })
 });