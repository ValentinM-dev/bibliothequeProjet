<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Author;
use PHPUnit\Framework\TestCase;

class AuthorTest extends TestCase
{
    private Author $author;
    protected function setUp(): void
    {
        $this->author = new Author();
    }

    public function testAuthorCreation(): void
    {
        $this->assertInstanceOf(Author::class, $this->author);
        $this->assertNull($this->author->getId());
    }

    public function testSetAndGetFirstName(): void
    {
        $author = 'Tatiana';
        $result = $this->author->setFirstName($author);
        $this->assertInstanceOf(Author::class, $result);
        $this->assertEquals($author, $this->author->getFirstName());
    }
    public function testSetAndGetLastName(): void
    {
        $lastName = 'De Rosnay';
        $result = $this->author->setLastName($lastName);
        $this->assertInstanceOf(Author::class, $result);
        $this->assertEquals($lastName, $this->author->getLastName());
    }
    public function testSetAndGetCountry(): void
    {
        $country = 'Suisse';
        $result = $this->author->setCountry($country);
        $this->assertInstanceOf(Author::class, $result);
        $this->assertEquals($country, $this->author->getCountry());
    }
    public function testFluentInterface(): void
    {
        $result = $this->author
            ->setFirstName('Test Author')
            ->setLastName('Test Author')
            ->setCountry('Ville Test');
        // Chaque méthode doit retourner l'instance de l'auteur
        $this->assertSame($this->author, $result);
    }
    /**
     * Test avec des données vides/nulles
     */
    public function testInitialNullValues(): void
    {
        $author = new Author();
        $this->assertNull($author->getFirstName());
        $this->assertNull($author->getLastName());
        $this->assertNull($author->getCountry());
    }
}